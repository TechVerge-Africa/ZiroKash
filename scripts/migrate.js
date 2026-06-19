import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const dryRun = process.env.DRY_RUN !== 'false';

if (!supabaseUrl || !serviceRoleKey || !paystackSecretKey) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing environment variables.');
  console.log('\nUsage:');
  console.log('  SUPABASE_URL="your-supabase-url" \\');
  console.log('  SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \\');
  console.log('  PAYSTACK_SECRET_KEY="your-new-paystack-secret-key" \\');
  console.log('  DRY_RUN=false \\');
  console.log('  node scripts/migrate.js\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log(`\n=== Starting Paystack Migration (Dry-Run: ${dryRun}) ===\n`);

  // Fetch all merchants
  const { data: merchants, error: fetchError } = await supabase
    .from('merchants')
    .select('*');

  if (fetchError) {
    console.error('Error fetching merchants:', fetchError.message);
    process.exit(1);
  }

  if (!merchants || merchants.length === 0) {
    console.log('No merchants found in database.');
    return;
  }

  console.log(`Found ${merchants.length} merchants to evaluate.\n`);

  for (const merchant of merchants) {
    console.log(`Evaluating merchant: ${merchant.business_name} (ID: ${merchant.id})`);

    // 1. Check for settlement details
    if (!merchant.settlement_bank_code || !merchant.settlement_account_number) {
      console.log(`  -> \x1b[33mSkipped:\x1b[0m Missing bank code or account number.\n`);
      continue;
    }

    // 2. Check if subaccount is already valid on the new Paystack account
    if (merchant.paystack_subaccount_code) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/subaccount/${merchant.paystack_subaccount_code}`, {
          headers: { Authorization: `Bearer ${paystackSecretKey}` }
        });

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.status === true) {
            console.log(`  -> \x1b[32mSkipped:\x1b[0m Subaccount code ${merchant.paystack_subaccount_code} is already valid on this Paystack account.\n`);
            continue;
          }
        }
      } catch (err) {
        console.warn(`  -> Warning verification failed: ${err.message}`);
      }
    }

    // 3. Recreate/Create subaccount
    if (dryRun) {
      console.log(`  -> \x1b[36mWould Recreate:\x1b[0m Bank: ${merchant.settlement_bank_code}, Account: ${merchant.settlement_account_number.slice(-4).padStart(10, '*')}\n`);
    } else {
      try {
        console.log(`  -> Creating new subaccount on Paystack...`);
        const commissionPercentage = Math.round((Number(merchant.commission_rate) || 0.01) * 100);

        const createRes = await fetch('https://api.paystack.co/subaccount', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            business_name: merchant.business_name,
            settlement_bank: merchant.settlement_bank_code,
            account_number: merchant.settlement_account_number,
            percentage_charge: commissionPercentage,
            primary_contact_email: merchant.business_email || 'settlement@zirokash.com'
          })
        });

        const createData = await createRes.json();

        if (!createRes.ok || !createData.status) {
          console.error(`  -> \x1b[31mFailed:\x1b[0m Paystack error: ${createData.message || 'Unknown'}\n`);
          continue;
        }

        const newSubaccountCode = createData.data.subaccount_code;
        console.log(`  -> Subaccount created on Paystack: ${newSubaccountCode}`);

        // Update database
        const { error: updateError } = await supabase
          .from('merchants')
          .update({
            paystack_subaccount_code: newSubaccountCode,
            updated_at: new Date().toISOString(),
            verification_status: 'verified'
          })
          .eq('id', merchant.id);

        if (updateError) {
          console.error(`  -> \x1b[31mPartially Failed:\x1b[0m Subaccount created but database update failed: ${updateError.message}\n`);
        } else {
          console.log(`  -> \x1b[32mSuccess:\x1b[0m Database updated with ${newSubaccountCode}.\n`);
        }
      } catch (err) {
        console.error(`  -> \x1b[31mFailed:\x1b[0m Exception: ${err.message}\n`);
      }
    }
  }

  console.log('=== Migration run complete ===\n');
}

runMigration().catch(console.error);

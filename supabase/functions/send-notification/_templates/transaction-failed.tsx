import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface TransactionFailedEmailProps {
  recipientName: string;
  transactionType: string;
  amount: string;
  currency: string;
  reference: string;
  reason: string;
}

export const TransactionFailedEmail = ({
  recipientName,
  transactionType,
  amount,
  currency,
  reference,
  reason,
}: TransactionFailedEmailProps) => (
  <Html>
    <Head />
    <Preview>Transaction Failed - Action Required</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Transaction Failed ✗</Heading>
        <Text style={text}>Hello {recipientName},</Text>
        <Text style={text}>
          Unfortunately, your {transactionType} of {currency} {amount} could not be completed.
        </Text>
        <Section style={detailsBox}>
          <Text style={detailsText}>
            <strong>Amount:</strong> {currency} {amount}
          </Text>
          <Text style={detailsText}>
            <strong>Type:</strong> {transactionType}
          </Text>
          <Text style={detailsText}>
            <strong>Reference:</strong> {reference}
          </Text>
          <Text style={detailsText}>
            <strong>Reason:</strong> {reason}
          </Text>
        </Section>
        <Text style={text}>
          Please try again or contact our support team if the issue persists.
        </Text>
        <Text style={footer}>
          <Link
            href="https://financeapp.com/support"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Contact Support
          </Link>
          <br />
          Finance App - We're here to help
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TransactionFailedEmail;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

const h1 = {
  color: '#d32f2f',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const detailsBox = {
  backgroundColor: '#ffebee',
  borderRadius: '5px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #ef5350',
};

const detailsText = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '8px 0',
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};

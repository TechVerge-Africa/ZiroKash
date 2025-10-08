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

interface TransactionSuccessEmailProps {
  recipientName: string;
  transactionType: string;
  amount: string;
  currency: string;
  reference: string;
  date: string;
}

export const TransactionSuccessEmail = ({
  recipientName,
  transactionType,
  amount,
  currency,
  reference,
  date,
}: TransactionSuccessEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {transactionType} was successful</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Transaction Successful ✓</Heading>
        <Text style={text}>Hello {recipientName},</Text>
        <Text style={text}>
          Your {transactionType} of {currency} {amount} has been completed successfully.
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
            <strong>Date:</strong> {date}
          </Text>
        </Section>
        <Text style={text}>
          If you have any questions, please contact our support team.
        </Text>
        <Text style={footer}>
          <Link
            href="https://financeapp.com"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Finance App
          </Link>
          <br />
          Secure. Fast. Reliable.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TransactionSuccessEmail;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

const h1 = {
  color: '#333',
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
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  padding: '20px',
  margin: '24px 0',
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

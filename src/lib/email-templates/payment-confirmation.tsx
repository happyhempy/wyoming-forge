import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";
import {
  SITE_NAME,
  SITE_URL,
  brandBar,
  button,
  card,
  container,
  footer,
  h1,
  list,
  main,
  muted,
  text,
} from "./_styles";

interface Props {
  firstName?: string;
  packageName?: string;
  amount?: string;
}

const PaymentConfirmation = ({ firstName, packageName, amount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Payment received — your {SITE_NAME} LLC formation has started</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            {firstName ? `Thank you, ${firstName}!` : "Thank you for your payment!"}
          </Heading>
          <Text style={text}>
            We've received your payment{amount ? ` of ${amount}` : ""} for the{" "}
            <strong>{packageName || "LLC formation"}</strong> package. Your Wyoming LLC
            formation is officially underway.
          </Text>
          <Text style={text}>
            <strong>What happens next:</strong>
          </Text>
          <ol style={list}>
            <li>Complete the intake form on your dashboard (5 minutes)</li>
            <li>Upload your passport photo</li>
            <li>We file your Articles of Organization within 24-48 hours</li>
            <li>You receive your EIN, Operating Agreement, and Registered Agent details</li>
          </ol>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              Go to your dashboard
            </Button>
          </Section>
          <Text style={muted}>
            Need help? Just reply to this email — we read every message.
          </Text>
        </Section>
        <Text style={footer}>
          © {new Date().getFullYear()} {SITE_NAME} • Wyoming LLC formation specialists
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: PaymentConfirmation,
  subject: "Payment received — your USADOC LLC is underway",
  displayName: "Payment confirmation",
  previewData: { firstName: "Jane", packageName: "Business", amount: "$399" },
} satisfies TemplateEntry;

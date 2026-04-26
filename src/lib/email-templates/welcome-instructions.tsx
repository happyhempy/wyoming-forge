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
  h2,
  list,
  main,
  muted,
  text,
} from "./_styles";

interface Props {
  firstName?: string;
}

const WelcomeInstructions = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>What we need from you to file your Wyoming LLC</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            {firstName ? `Welcome, ${firstName}!` : "Welcome to USADOC!"}
          </Heading>
          <Text style={text}>
            To file your Wyoming LLC, we need a few things from you. The whole
            process takes about 5-10 minutes.
          </Text>

          <Heading as="h2" style={h2}>1. Complete your intake form</Heading>
          <Text style={text}>
            We need your proposed LLC name, business purpose, and basic owner details.
            This information goes directly onto your Articles of Organization.
          </Text>

          <Heading as="h2" style={h2}>2. Upload your passport</Heading>
          <Text style={text}>
            A clear photo of your passport's main page (the page with your photo).
            We use this for KYC and your EIN application.
          </Text>

          <Heading as="h2" style={h2}>3. Sit back — we handle the rest</Heading>
          <Text style={text}>You'll receive email updates at every key step:</Text>
          <ul style={list}>
            <li>Articles of Organization filed</li>
            <li>EIN application submitted</li>
            <li>EIN received from IRS</li>
            <li>Registered Agent confirmed</li>
            <li>Mercury bank account ready (if included)</li>
          </ul>

          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              Start your intake form
            </Button>
          </Section>

          <Text style={muted}>
            Questions? Reply to this email anytime.
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
  component: WelcomeInstructions,
  subject: "What we need to file your Wyoming LLC",
  displayName: "Welcome & instructions",
  previewData: { firstName: "Jane" },
} satisfies TemplateEntry;

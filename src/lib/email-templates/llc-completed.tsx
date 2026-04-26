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
  llcName?: string;
}

const LLCCompleted = ({ firstName, llcName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Wyoming LLC is officially open for business 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            🎉 {firstName ? `${firstName}, ` : ""}your LLC is ready!
          </Heading>
          <Text style={text}>
            Congratulations! <strong>{llcName || "Your Wyoming LLC"}</strong> is
            officially registered, has an EIN, and is ready to do business in
            the United States.
          </Text>
          <Text style={text}>
            All your documents are now available in your dashboard:
          </Text>
          <ul style={list}>
            <li>Articles of Organization (filed with Wyoming Secretary of State)</li>
            <li>EIN Confirmation Letter (from IRS)</li>
            <li>Operating Agreement (signed)</li>
            <li>Registered Agent Confirmation</li>
          </ul>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              Download your documents
            </Button>
          </Section>
          <Text style={text}>
            <strong>Important reminder:</strong> Your Wyoming Registered Agent
            and annual compliance are covered for the duration of your package.
            We'll email you well before renewal time.
          </Text>
          <Text style={muted}>
            Need a Mercury bank account, CPA referral, or anything else? Just reply
            to this email.
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
  component: LLCCompleted,
  subject: "🎉 Your Wyoming LLC is officially open!",
  displayName: "LLC completed",
  previewData: { firstName: "Jane", llcName: "Acme Holdings LLC" },
} satisfies TemplateEntry;

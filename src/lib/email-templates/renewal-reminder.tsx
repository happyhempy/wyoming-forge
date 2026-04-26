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
  expiresOn?: string;
}

const RenewalReminder = ({ firstName, llcName, expiresOn }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Action needed: renew your Wyoming LLC compliance</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            {firstName ? `${firstName}, time to renew` : "Time to renew your LLC"}
          </Heading>
          <Text style={text}>
            Your USADOC compliance package for{" "}
            <strong>{llcName || "your Wyoming LLC"}</strong> expires
            {expiresOn ? ` on ${expiresOn}` : " in 30 days"}.
          </Text>
          <Text style={text}>
            <strong>Renewal — $300 / year</strong>, includes:
          </Text>
          <ul style={list}>
            <li>Wyoming Registered Agent service</li>
            <li>Annual report filing with the Wyoming Secretary of State</li>
            <li>Compliance reminders and document storage</li>
            <li>Direct support from your case manager</li>
          </ul>
          <Text style={text}>
            Renewing on time keeps your LLC in good standing — letting it lapse
            can lead to administrative dissolution by the state.
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              Renew now
            </Button>
          </Section>
          <Text style={muted}>
            Questions about renewal? Just reply to this email.
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
  component: RenewalReminder,
  subject: "Action needed: renew your Wyoming LLC ($300/year)",
  displayName: "Renewal reminder",
  previewData: {
    firstName: "Jane",
    llcName: "Acme Holdings LLC",
    expiresOn: "April 26, 2026",
  },
} satisfies TemplateEntry;

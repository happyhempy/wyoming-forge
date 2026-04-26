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
  main,
  muted,
  text,
} from "./_styles";

interface Props {
  firstName?: string;
  llcName?: string;
}

const CoverageExpired = ({ firstName, llcName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Wyoming LLC compliance has expired — act now</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            ⚠️ Your compliance coverage has expired
          </Heading>
          <Text style={text}>
            {firstName ? `Hi ${firstName}, ` : "Hi, "}your USADOC compliance
            coverage for{" "}
            <strong>{llcName || "your Wyoming LLC"}</strong> ended yesterday.
          </Text>
          <Text style={text}>
            <strong>What this means:</strong> we are no longer acting as your
            Registered Agent, and we will not file your next Wyoming annual
            report on your behalf. Without an active Registered Agent, the state
            of Wyoming can administratively dissolve your LLC.
          </Text>
          <Text style={text}>
            Renew today for <strong>$300/year</strong> to restore your
            Registered Agent and annual report service immediately.
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              Renew now
            </Button>
          </Section>
          <Text style={muted}>
            Questions or need help? Reply to this email — we're here.
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
  component: CoverageExpired,
  subject: "⚠️ Your Wyoming LLC compliance has expired",
  displayName: "Coverage expired",
  previewData: { firstName: "Jane", llcName: "Acme Holdings LLC" },
} satisfies TemplateEntry;

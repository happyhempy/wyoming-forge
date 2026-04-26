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
}

const DocumentsReceived = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your documents — filing starts now</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            {firstName ? `Got it, ${firstName}!` : "We've got your documents!"}
          </Heading>
          <Text style={text}>
            Your intake form and documents have been received and verified. Our
            team is reviewing everything and will start the Wyoming filing
            process within the next 24 hours.
          </Text>
          <Text style={text}>
            We'll email you the moment your Articles of Organization are filed
            and again when your EIN is issued.
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              Track your case
            </Button>
          </Section>
          <Text style={muted}>
            Need to update something? Reply to this email and we'll take care of it.
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
  component: DocumentsReceived,
  subject: "Documents received — filing starts now",
  displayName: "Documents received",
  previewData: { firstName: "Jane" },
} satisfies TemplateEntry;

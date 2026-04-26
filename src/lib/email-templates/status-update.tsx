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
  stepName?: string;
  stepNumber?: number;
  totalSteps?: number;
  note?: string;
}

const StatusUpdate = ({ firstName, stepName, stepNumber, totalSteps, note }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Update on your Wyoming LLC: {stepName || "new milestone"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME}</Section>
        <Section style={card}>
          <Heading style={h1}>
            {stepName ? `${stepName} ✓` : "Progress update"}
          </Heading>
          <Text style={text}>
            {firstName ? `Hi ${firstName}, ` : "Hi! "}
            we've completed another milestone on your Wyoming LLC formation.
          </Text>
          {stepNumber && totalSteps && (
            <Text style={text}>
              <strong>Step {stepNumber} of {totalSteps}</strong>
              {stepName ? ` — ${stepName}` : ""}
            </Text>
          )}
          {note && <Text style={text}>{note}</Text>}
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/dashboard`}>
              View full progress
            </Button>
          </Section>
          <Text style={muted}>
            Questions? Reply to this email anytime — your case manager reads every message.
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
  component: StatusUpdate,
  subject: (data: Record<string, any>) =>
    data.stepName
      ? `Update: ${data.stepName} — your USADOC LLC`
      : "Update on your USADOC LLC",
  displayName: "Status update",
  previewData: {
    firstName: "Jane",
    stepName: "Articles of Organization Filed",
    stepNumber: 3,
    totalSteps: 8,
  },
} satisfies TemplateEntry;

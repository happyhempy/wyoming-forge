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
  main,
  muted,
  text,
} from "./_styles";

interface Props {
  clientName?: string;
  clientEmail?: string;
  llcName?: string;
  packageName?: string;
  amount?: string;
}

const NewClientAlert = ({ clientName, clientEmail, llcName, packageName, amount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New client payment — ${clientName || "New client"} (${packageName || "—"})`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>{SITE_NAME} — Admin Alert</Section>
        <Section style={card}>
          <Heading style={h1}>New Client Payment Received</Heading>
          <Text style={text}>
            A new client has paid and their case is ready for processing.
          </Text>

          <Text style={{ ...h2, marginTop: 0 }}>Client Details</Text>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "14px" }}>
            <tbody>
              {[
                ["Name", clientName || "—"],
                ["Email", clientEmail || "—"],
                ["LLC Name", llcName || "Not filled yet"],
                ["Package", packageName || "—"],
                ["Amount", amount || "—"],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ padding: "6px 8px", color: "#6b7280", width: "35%", verticalAlign: "top" as const }}>{label}</td>
                  <td style={{ padding: "6px 8px", color: "#1a1a2e", fontWeight: 600 }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button style={button} href={`${SITE_URL}/admin`}>
              Open Admin Panel →
            </Button>
          </Section>

          <Text style={muted}>
            The client will receive their welcome email and payment confirmation automatically.
            Please process their case within 24 hours.
          </Text>
        </Section>
        <Text style={footer}>
          © {new Date().getFullYear()} {SITE_NAME} — Internal notification
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: NewClientAlert,
  subject: ({ clientName, packageName }: Record<string, any>) =>
    `New client: ${clientName || "Unknown"} — ${packageName || "LLC"} package`,
  displayName: "New client alert (admin)",
  to: "happyhempyil@gmail.com",
  previewData: {
    clientName: "Jane Smith",
    clientEmail: "jane@example.com",
    llcName: "Jane Smith LLC",
    packageName: "Formation + EIN",
    amount: "$399",
  },
} satisfies TemplateEntry;

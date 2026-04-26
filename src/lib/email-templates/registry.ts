import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
import { template as paymentConfirmation } from './payment-confirmation'
import { template as welcomeInstructions } from './welcome-instructions'
import { template as documentsReceived } from './documents-received'
import { template as statusUpdate } from './status-update'
import { template as llcCompleted } from './llc-completed'
import { template as renewalReminder } from './renewal-reminder'
import { template as coverageExpired } from './coverage-expired'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'payment-confirmation': paymentConfirmation,
  'welcome-instructions': welcomeInstructions,
  'documents-received': documentsReceived,
  'status-update': statusUpdate,
  'llc-completed': llcCompleted,
  'renewal-reminder': renewalReminder,
  'coverage-expired': coverageExpired,
}

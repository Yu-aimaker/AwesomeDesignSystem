# Enterprise workflows: Lightning, Intuit and Garden

## Salesforce Lightning — make domain state visible

**Pages:** [guidelines overview](https://www.lightningdesignsystem.com/guidelines/overview/), [components](https://www.lightningdesignsystem.com/components/), and [React implementation](https://github.com/salesforce/design-system-react).

Lightning is useful when work is organized around durable records, queues and multi-step processes. Its transferable lesson is not dense panels or Salesforce terminology. It is that domain objects need explicit anatomy: identity, status, primary action, history, related records, permissions and next step. Progress and activity components are views over a state model, not decoration.

**AwesomeDS adoption:** every object-centric workflow must define states, permitted transitions, actor/permission boundaries, stale/conflict handling, audit history and recovery. A table, record page and timeline that represent the same object must use the same status vocabulary.

**Do not copy:** Salesforce's object model, information density, styling, scoped CSS architecture or package API. Verify the preferred platform implementation before using the public React repository.

## Intuit — design trust as recoverability

**Pages:** [Intuit Design System](https://designsystem.intuit.com/), [Content Design](https://contentdesign.intuit.com/), and [accessibility](https://www.intuit.com/accessibility/).

Financial and tax tasks expose a general rule: friendly tone cannot compensate for an irreversible or unexplained consequence. Users need plain-language meaning, visible assumptions, review before commitment, correction paths, and records of what happened.

**AwesomeDS adoption:** high-stakes flows declare the consequence, effective time, amount/data affected, authority, and reversal path before confirmation. Errors say what happened, what remains safe, what the user can do, and how to escalate. Explanations must not obscure required legal or financial disclosure.

**Do not copy:** Intuit's product language, legal wording, reassurance style or jurisdiction-specific claims. Require domain, legal and accessibility review.

## Zendesk Garden — optimize long-lived support work without hiding meaning

**Pages:** [Garden](https://garden.zendesk.com/), [component index](https://garden.zendesk.com/components/), and [public packages](https://github.com/zendeskgarden).

Garden demonstrates the needs of high-frequency, long-lived enterprise interfaces: compact controls, form-heavy workflows, conversation state, theming, bidirectionality and modular packages. Density is successful only when focus order, target size, status, errors and keyboard operation remain legible.

**AwesomeDS adoption:** density is an explicit mode, never an accidental compression. Dense mode must preserve semantic hierarchy, 200% zoom/reflow, keyboard reachability, visible focus, readable state labels and safe destructive actions. Conversation/ticket-like work must distinguish draft, sending, delivered, failed, internal and external states.

**Do not copy:** ticketing information architecture, support-agent assumptions or Zendesk identity. Check individual package maintenance and license before implementation.

## Combined doctrine

| Contract | Required evidence |
|---|---|
| Domain state | Named state machine, transition guards, conflict/stale behavior |
| Consequence | Scope, timing, cost/data impact and authority visible before commit |
| Recovery | Cancel/undo/correct/escalate paths proportionate to risk |
| History | Actor, action, time and result available where accountability matters |
| Density | Keyboard, zoom/reflow, focus and target-size validation |
| Content | Domain vocabulary registry; actionable errors; localization review |

The synthesis is deliberate: Lightning contributes explicit domain state, Intuit contributes high-stakes trust and content, and Garden contributes the operational reality of sustained expert work.

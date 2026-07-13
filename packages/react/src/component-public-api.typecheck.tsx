import {
  Accordion,
  AlertDialog,
  Badge,
  Breadcrumb,
  Dialog,
  DropdownMenu,
  RadioGroup,
  Tabs,
  type AccordionItem,
  type BadgeTone,
  type BreadcrumbItem,
  type DropdownMenuItem,
  type RadioOption,
  type TabItem,
} from "./index";

const tone: BadgeTone = "accent";
const accordionItems: AccordionItem[] = [{ id: "one", title: "One", content: "Body" }];
const breadcrumbItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
const menuItems: DropdownMenuItem[] = [{ id: "edit", label: "Edit" }];
const radioOptions: RadioOption[] = [{ value: "one", label: "One" }];
const tabItems: TabItem[] = [{ value: "one", label: "One", content: "Body" }];

export const validPublicApiExamples = (
  <>
    <Badge tone={tone}>New</Badge>
    <Accordion items={accordionItems} />
    <Breadcrumb items={breadcrumbItems} />
    <DropdownMenu label="Actions" items={menuItems} />
    <RadioGroup legend="Choice" name="choice" options={radioOptions} />
    <Tabs items={tabItems} />
    <Dialog open title="Title" onClose={() => undefined}>Body</Dialog>
    <AlertDialog open title="Delete" onClose={() => undefined} onConfirm={() => undefined}>Body</AlertDialog>
  </>
);

// @ts-expect-error danger is an internal AlertDialog variant, not a Dialog prop.
export const invalidDangerDialog = <Dialog open danger title="Title" onClose={() => undefined}>Body</Dialog>;
// @ts-expect-error closeLabel is not rendered by AlertDialog and must not be accepted.
export const invalidAlertCloseLabel = <AlertDialog open closeLabel="Close" title="Delete" onClose={() => undefined} onConfirm={() => undefined}>Body</AlertDialog>;
// @ts-expect-error destructive confirmation always requires an operation.
export const invalidAlertWithoutConfirm = <AlertDialog open title="Delete" onClose={() => undefined}>Body</AlertDialog>;

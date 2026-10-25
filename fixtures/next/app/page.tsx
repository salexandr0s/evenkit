import { ArrowRightIcon, Badge, Button, ButtonLink, PlusIcon, Select, SelectField, TextareaField, TextField, type ButtonShape, type SelectOptionGroup, type TextareaFieldProps } from "@evenkit/ui";
import { PreviewDialog } from "./preview-dialog";
import { PreviewAdmin } from "./preview-admin";
import { PreviewChat } from "./preview-chat";
import { PriorityFixture } from "./priority-fixture";
import { ActionMessage, EmptyState, Skeleton, Spinner, type ActionMessageTone, type BadgeSize, type BadgeTone, type BadgeVariant, type EmptyStateAlign, type EmptyStateSize, type EmptyStateTitleTag, type SkeletonSize, type SkeletonVariant, type SpinnerSize } from "@evenkit/ui";

export default function Page() {
  const iconShape: ButtonShape = "icon";
  const badgeTone: BadgeTone = "success";
  const badgeSize: BadgeSize = "sm";
  const badgeVariant: BadgeVariant = "outline";
  const messageTone: ActionMessageTone = "warning";
  const spinnerSize: SpinnerSize = "sm";
  const skeletonSize: SkeletonSize = "lg";
  const skeletonVariant: SkeletonVariant = "avatar";
  const emptySize: EmptyStateSize = "sm";
  const emptyAlign: EmptyStateAlign = "start";
  const emptyTitleTag: EmptyStateTitleTag = "h2";
  const notesProps: TextareaFieldProps = { label: "Notes", name: "notes", optional: true, hint: "Details for the team.", rows: 3 };
  const templates: SelectOptionGroup = { id: "team", label: "Team templates", options: [{ value: "blank", label: "Blank project", description: "Start with an empty project." }] };
  return <main>
    <h1>Packed package check</h1>
    <PriorityFixture />
    <Badge tone={badgeTone} size={badgeSize} variant={badgeVariant} dot>Next.js consumer</Badge>
    <ActionMessage tone={messageTone} heading="Review the package" title="Packed feedback" role="note" icon={null}
      actions={<ButtonLink href="#projects">Review projects</ButtonLink>}>Persistent feedback from the installed package.</ActionMessage>
    <p role="status"><Spinner size={spinnerSize} aria-hidden="true" />Loading package preview</p>
    <Skeleton size={skeletonSize} variant={skeletonVariant} />
    <EmptyState title="No saved projects" titleAs={emptyTitleTag} size={emptySize} align={emptyAlign} icon={<PlusIcon />}
      description="Choose a starting point for your workspace."
      action={<ButtonLink href="#projects">Browse projects</ButtonLink>}
      secondaryAction={<ButtonLink href="#templates" variant="outline">Browse templates</ButtonLink>} />
    <TextField label="Project name" defaultValue="Independent consumer" required startAdornment={<PlusIcon />} />
    <TextareaField {...notesProps} />
    <SelectField label="Project template" name="template" options={[templates]} defaultValue="blank" hint="Choose a starting point." required />
    <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
    <Button>Native button</Button>
    <Button shape={iconShape} aria-label="Create project"><PlusIcon /></Button>
    <Button fullWidth startIcon={<PlusIcon />}>Create project</Button>
    <ButtonLink href="#projects" endIcon={<ArrowRightIcon />}>View projects</ButtonLink>
    <PreviewDialog />
    <PreviewAdmin />
    <PreviewChat />
  </main>;
}

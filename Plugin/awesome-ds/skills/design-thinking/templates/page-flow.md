# Page flow: {{FEATURE}}  / 画面フロー

Legend: rectangle = route or screen, diamond = user decision, dashed = system state (loading, empty, error), red edge = dead end to fix.

```mermaid
flowchart TD
  entry([Entry: {{where users come from}}]) --> home[/{{route}}/]
  home -->|primary action| create[/{{route}}/create/]
  home -.-> home_loading([loading: skeleton])
  home -.-> home_empty([empty: first-run message + primary action])
  home -.-> home_error([error: message + retry])
  create --> valid{valid input?}
  valid -->|yes| saving([saving: button loading state])
  valid -->|no| create_error([inline field errors])
  create_error --> create
  saving --> done[/{{route}}/{{id}}/]
  saving -.-> save_error([error toast + keep input])
  save_error --> create
  done -->|back| home
  create -->|cancel| home
```

| Route | Purpose | Primary action | States covered | First-arriving persona |
|---|---|---|---|---|
| `/{{route}}` | {{}} | {{one}} | loading, empty, error | {{}} |
| `/{{route}}/create` | {{}} | {{}} | validation, saving, save error | {{}} |

Checks
- [ ] Every route has loading, empty and error nodes.
- [ ] Every forward step has a back or cancel edge.
- [ ] No node has zero outgoing edges except the final success screen.
- [ ] One primary action per route.

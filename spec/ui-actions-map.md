# UI Actions Map

## Component Action Mapping

### Main Dashboard
- **Start Meditation Button**
  - Action: `INITIATE_MEDITATION_SESSION`
  - Navigation: → Session Setup Screen
  - State Change: Idle → PreSession

- **Progress Card**
  - Action: `VIEW_DETAILED_PROGRESS`
  - Navigation: → Progress Screen
  - State Change: None (overlay/modal)

- **Stress Check Button**
  - Action: `ASSESS_STRESS_LEVEL`
  - Navigation: → Stress Assessment Screen
  - State Change: None

### Session Setup Screen
- **Meditation Type Selector**
  - Actions: `SELECT_BREATHING`, `SELECT_BODY_SCAN`, `SELECT_MINDFULNESS`, `SELECT_LOVING_KINDNESS`
  - Navigation: None
  - State Change: Update session configuration

- **Duration Slider**
  - Action: `SET_SESSION_DURATION`
  - Navigation: None
  - State Change: Update session configuration

- **Begin Session Button**
  - Action: `BEGIN_MEDITATION_SESSION`
  - Navigation: → Active Session Screen
  - State Change: PreSession → Active

### Active Session Screen
- **Pause Button**
  - Action: `PAUSE_SESSION`
  - Navigation: None
  - State Change: Active → Paused

- **End Session Button**
  - Action: `END_SESSION`
  - Navigation: → Post Session Screen
  - State Change: Active → PostSession

- **Progress Ring**
  - Action: None (display only)
  - Shows: Time remaining, session progress

### Paused Session Screen
- **Resume Button**
  - Action: `RESUME_SESSION`
  - Navigation: → Active Session Screen
  - State Change: Paused → Active

- **End Session Button**
  - Action: `END_SESSION`
  - Navigation: → Post Session Screen
  - State Change: Paused → PostSession

### Post Session Screen
- **Reflection Input**
  - Action: `SUBMIT_REFLECTION`
  - Navigation: None
  - State Change: Update session data

- **Rating Selector**
  - Action: `SUBMIT_SESSION_RATING`
  - Navigation: None
  - State Change: Update session data

- **Complete Button**
  - Action: `COMPLETE_SESSION`
  - Navigation: → Main Dashboard
  - State Change: PostSession → Idle

### Progress Screen
- **Streak Display**
  - Action: None (display only)
  - Shows: Current streak, longest streak

- **Calendar View**
  - Action: `VIEW_SESSION_DETAILS`
  - Navigation: → Session Detail Modal
  - State Change: None

- **Statistics Cards**
  - Action: None (display only)
  - Shows: Total sessions, average duration, stress trends

## Voice Command Mappings

- "Start meditation" → `INITIATE_MEDITATION_SESSION`
- "Pause" → `PAUSE_SESSION`
- "Resume" → `RESUME_SESSION`
- "End session" → `END_SESSION`
- "Show my progress" → `VIEW_DETAILED_PROGRESS`
- "How am I doing?" → `VIEW_DETAILED_PROGRESS`
- "I'm stressed" → `ASSESS_STRESS_LEVEL`
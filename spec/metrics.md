# Metrics Specification

## Core Metrics

### Streak Tracking
- **Current Streak**: Consecutive days with at least one meditation session
- **Longest Streak**: Historical maximum consecutive days
- **Streak Goal**: User-defined target (default: 7 days)
- **Streak Status**: Active, Broken, or At Risk (if no session today)

### Session Metrics
- **Total Sessions**: Lifetime count of completed meditation sessions
- **Total Duration**: Cumulative meditation time (minutes)
- **Average Session Length**: Mean duration across all sessions
- **Sessions This Week**: Count for current 7-day period
- **Sessions This Month**: Count for current calendar month

### Stress Level Tracking
- **Pre-Session Stress**: 1-10 scale before meditation
- **Post-Session Stress**: 1-10 scale after meditation
- **Stress Reduction**: Calculated improvement per session
- **Average Stress Trend**: 7-day and 30-day moving averages
- **Stress Improvement Score**: Overall trend indicator

### Meditation Quality
- **Session Rating**: User-provided 1-5 star rating
- **Focus Quality**: Self-reported concentration level (1-10)
- **Completion Rate**: Percentage of sessions completed vs. started
- **Preferred Meditation Types**: Most frequently chosen techniques

## Data Structure

### Session Record
```json
{
  "id": "uuid",
  "timestamp": "ISO 8601",
  "type": "breathing|body_scan|mindfulness|loving_kindness",
  "planned_duration": "minutes",
  "actual_duration": "minutes",
  "completed": "boolean",
  "pre_stress_level": "1-10",
  "post_stress_level": "1-10",
  "session_rating": "1-5",
  "focus_quality": "1-10",
  "reflection_notes": "string",
  "interruptions": "number"
}
```

### User Metrics Summary
```json
{
  "user_id": "uuid",
  "current_streak": "number",
  "longest_streak": "number",
  "total_sessions": "number",
  "total_duration_minutes": "number",
  "average_session_length": "number",
  "completion_rate": "percentage",
  "average_stress_reduction": "number",
  "last_session_date": "ISO 8601",
  "streak_goal": "number",
  "preferred_meditation_type": "string"
}
```

## Calculation Rules

### Streak Calculation
- Streak increments when user completes at least one session per day
- Streak resets to 0 if no session completed for 24+ hours
- Grace period: 2-hour buffer past midnight for late sessions

### Stress Improvement
- Calculated as: `pre_stress_level - post_stress_level`
- Positive values indicate improvement
- Averaged over rolling 7-day and 30-day windows

### Completion Rate
- `(completed_sessions / started_sessions) * 100`
- Sessions counted as "started" when user begins active meditation
- Sessions counted as "completed" when user reaches planned duration or manually ends with >50% completion

## Display Formats

### Dashboard Cards
- **Streak Card**: "🔥 5 Day Streak" with progress toward goal
- **Progress Card**: "12 sessions this month" with visual progress bar
- **Stress Card**: "Avg. stress reduced by 3.2 points" with trend arrow

### Progress Screen
- **Calendar Heatmap**: Visual representation of daily meditation activity
- **Trend Charts**: Line graphs for stress levels, session frequency
- **Achievement Badges**: Milestone rewards (7-day streak, 50 sessions, etc.)

## Privacy & Storage
- All metrics stored locally on device
- Optional cloud backup with user consent
- Data export available in JSON format
- User can reset all metrics with confirmation dialog
import {z} from 'zod'

const Properties = z.array(
    z.object({
        Key: z.string(),
    }),
)

const QuestStep = z.object({
    StepId: z.string(),
    StepType: z.string(),
    DependsOn: z.string(),
    Config: z.object({
        Properties,
    }),
})

export const Quest = z.object({
    Name: z.string(),
    UnlocksAfter: z.string(),
    Steps: z.array(QuestStep),
    Rewards: z.array(
        z.object({
            Properties,
        }),
    ),
})

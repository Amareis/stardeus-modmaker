import {z} from 'zod'

export interface Dir {
    kind: 'dir'
    path: string
    name: string
    handle: FileSystemDirectoryHandle
    children: Array<Dir | DirFile>
}

export interface DirFile {
    kind: 'file'
    path: string
    name: string
    handle: FileSystemFileHandle
    json?: Json
}

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | {[key: string]: Json} | Json[]
export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]),
)

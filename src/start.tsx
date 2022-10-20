import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import './global-styles.css'

import {createRoot} from 'react-dom/client'
import {DirView} from '/TreeView'
import {Dir, DirFile, JsonSchema} from '/types'
import {observable, configure, makeObservable} from 'mobx'
import {observer} from 'mobx-react'
import {Box, Button, CssBaseline, Grid} from '@mui/material'

configure({enforceActions: 'never'})

async function selectMod(): Promise<Dir> {
    /*let existing = await get('mod-dir')
    if (existing instanceof FileSystemDirectoryHandle)
        return existing*/

    const handle = await showDirectoryPicker()
    return getDir(handle, '/')
}

const decoder = new TextDecoder()

async function getDir(
    handle: FileSystemDirectoryHandle,
    path: string,
): Promise<Dir> {
    let dir: Dir = {
        kind: 'dir',
        name: handle.name,
        handle,
        children: [],
        path: path + handle.name + '/',
    }

    for await (const entry of handle.values()) {
        if (entry.kind === 'directory') {
            const d = await getDir(entry, dir.path)
            dir.children.push(d)
        } else {
            if (entry.name === '.DS_Store') continue

            let json = undefined
            if (entry.name.endsWith('.json')) {
                const content = JSON.parse(
                    decoder.decode(
                        await entry.getFile().then(f => f.arrayBuffer()),
                    ),
                )
                json = JsonSchema.parse(content)
            }
            dir.children.push({
                kind: 'file',
                path: dir.path + entry.name,
                name: entry.name,
                handle: entry,
                json,
            })
        }
    }
    dir.children.sort((a, b) => (a.name < b.name ? -1 : 1))
    return dir
}

class State {
    @observable.ref
    dir: Dir | null = null

    @observable.ref
    current: DirFile | null = null

    constructor() {
        makeObservable(this)
    }

    async load() {
        this.dir = await selectMod()
    }
}

export const state = new State()
// @ts-ignore
window.state = state

const App = observer(() => (
    <>
        <CssBaseline />
        <Grid container sx={{height: '100%', maxHeight: '100%'}}>
            <Grid item xs={3} sx={{height: '100%', maxHeight: '100%'}}>
                {state.dir ? (
                    <DirView data={state.dir} />
                ) : (
                    <Button variant="contained" onClick={() => state.load()}>
                        Select mod
                    </Button>
                )}
            </Grid>
            <Grid item xs={9} sx={{height: '100%', maxHeight: '100%'}}>
                {state.current && <DisplayFile file={state.current} />}
            </Grid>
        </Grid>
    </>
))

const DisplayFile = observer(({file}: {file: DirFile}) => {
    return (
        <>
            {file.json ? (
                <Box
                    component="pre"
                    sx={{height: '100%', maxHeight: '100%', overflowY: 'auto'}}
                >
                    {JSON.stringify(file.json, null, 2)}
                </Box>
            ) : (
                file.name
            )}
        </>
    )
})

onload = () => {
    const container = document.getElementById('app')!
    const root = createRoot(container)
    root.render(<App />)
}

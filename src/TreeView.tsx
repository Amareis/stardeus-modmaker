import {Dir, DirFile} from '/types'
import {TreeItem, TreeView} from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {state} from '/start'
import {observer} from 'mobx-react'

const TreeElement = observer(({node}: {node: Dir | DirFile}) => (
    <TreeItem
        key={node.path}
        nodeId={node.path}
        label={node.name}
        onClick={
            node.kind === 'dir'
                ? undefined
                : () => {
                      console.log(node)
                      state.current = node
                  }
        }
    >
        {node.kind === 'dir'
            ? node.children.map(node => (
                  <TreeElement key={node.path} node={node} />
              ))
            : null}
    </TreeItem>
))

export const DirView = observer(({data}: {data: Dir}) => (
    <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={[data.path]}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{maxHeight: '100%', overflowY: 'auto'}}
    >
        <TreeElement node={data} />
    </TreeView>
))

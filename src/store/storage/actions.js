import {nodeDataService} from './dataservice'

export async function initAction (context) {
    const node = await nodeDataService.getNode('root')
    context.commit('init',node)
}


import * as config from "config"


const graphqlConfig = config.graphql

export const GraphqlConfig = {
	autoSchemaFile: graphqlConfig.autoSchemaFile,
	playground: graphqlConfig.playground,
	path: graphqlConfig.path,
}
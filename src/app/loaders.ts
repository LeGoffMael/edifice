import { LoaderFunctionArgs } from "react-router-dom";
import { RootState } from "@/app/store";
import { getDatasetById } from "@/store/allDatasets";

export async function datasetLoader({ params }: LoaderFunctionArgs, state: RootState) {
    const dataset = getDatasetById(state, params.datasetId!);
    if (!dataset) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return dataset;
}
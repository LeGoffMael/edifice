import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { store } from '@/app/store'
import { datasetLoader } from '@/app/loaders';
import reportWebVitals from '@/reportWebVitals';

import App from '@/App';
import DatasetList from '@/features/datasets/DatasetList';
import AddDatasetForm from '@/features/datasets/AddDatasetForm';
import EditDatasetForm from '@/features/datasets/EditDatasetForm';
import CustomTagsForm from '@/features/customTags/CustomTagsForm';

import '@/index.css';
import InterrogatorMatcherTable from './features/customTags/InterrogatorMatcherTable';

export const datasetsRoute = '/datasets/select';
export const addDatasetRoute = '/datasets/add';
export const editDatasetRoute = '/datasets/edit/';
export const datasetCustomTagsRoute = '/datasets/custom-tags/';
export const datasetTagsMatcherRoute = '/datasets/tags-matcher/';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: datasetsRoute,
        element: <DatasetList />
      },
      {
        path: addDatasetRoute,
        element: <AddDatasetForm />
      },
      {
        path: editDatasetRoute + ':datasetId',
        element: <EditDatasetForm />,
        loader: (params) => datasetLoader(params, store.getState())
      },
      {
        path: datasetCustomTagsRoute + ':datasetId',
        element: <CustomTagsForm />,
        loader: (params) => datasetLoader(params, store.getState())
      },
      {
        path: datasetTagsMatcherRoute + ':datasetId',
        element: <InterrogatorMatcherTable />,
        loader: (params) => datasetLoader(params, store.getState())
      },
    ]
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

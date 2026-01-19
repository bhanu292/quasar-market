const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'sector-heatmap',
        component: () => import('pages/SectorHeatMapHeader.vue')
      }
    ]
  }
]

export default routes

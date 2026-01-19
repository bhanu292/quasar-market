<template>
    <q-page class="q-pa-md">

        <!--Header Section-->
        <q-card class="q-pa-md q-mb-md">
                <div class="text-h5 text-weight-bold">
                    MARKET SECTOR HEAT MAP
                </div>
                <div class="text-subtitle2 text-grey-7">
                    Performance Overview Across Sectors
                </div>
    </q-card>

    <!--Filter Bar-->
    <q-card class="q-pa-md q-mb-md">
        <div class="q-col-gutter-md items-center">

            <!--Sector Filter-->
            <div class="col-12 col-md-4">
                <q-select
                v-model="selectedSectors"
                :options="filteredSectorOptions"
                label="Sectors"
                multiple
                outlined
                use-chips/>
            </div>

            <!--Search Sector-->
            <div class="col-12 col-md-3">
                <q-input 
                v-model="sectorSearch"
                outlined 
                label="Search Sector"
                clearable
                @keyup.enter="applySectorSearch" >
                <template #append>
                    <q-icon name="search" />
                </template>
            </q-input>
            </div>

            <!--Timeline Filter-->
            <div class="col-12 col-md-3">
                <div class="text-subtitle2 q-mb-xs">
                    Timeframe
                </div>
                <q-btn-toggle 
                v-model="selectedTimeframe"
                toggle-color="primary"
                unelevated 
                :options="timeframeOptions"/>
            </div>

                <!--Reset-->
                <div class="col-12 col-md-2">
                <q-btn 
                label="Reset Filters"
                outline 
                color="primary"
                @click="resetFilters"/>
            </div>

        </div>
    </q-card>

    <!--Heat Map Section-->
    <div class="heat-map-grid">
         <q-card
        v-for="sector in visibleSectors"
        :key="sector.name"
        flat
        bordered
        class="heat-tile text-center q-pa-md"
        :class="getHeatColor(sector.change)"
        :style="tileStyle(sector)"
      >

        <!--Tooltip-->
        <q-tooltip class="bg-dark text-white q-pa-sm">
            <div class="textweight-bold">{{ sector.name }}</div>
            <div>% Change: {{ sector.change }}%</div>
            <div>Market Cap: {{ sector.marketCap }} Cr</div>
            <div class="q-mt-xs">
                <strong>Top Gainers:</strong>
                <div>{{ sector.topGainers.join(',')  || '-' }}</div>
            </div>
            <div class="q-mt-xs">
                <strong>Top Losers:</strong>
                <div>{{ sector.topLosers.join(',')  || '-' }}</div>
            </div>
        </q-tooltip>

        <!--Tile Content-->
        <div class="text-subtitle1 text-weight-bold">
            {{ sector.name }}
        </div>
        <div class="text-h6 q-mt-sm">
            {{ sector.change > 0 ? '+' : '' }}{{ sector.change }}%
        </div>

        </q-card>
        </div>
        
    </q-page>
    </template>

    <script setup>
        import { ref,computed,watch } from 'vue'

        /* Base Sector Data */
      const baseSectorData = [
  {
    name: 'Banking',
    marketCap: 2200,
    topGainers: ['HDFC', 'ICICI'],
    topLosers: ['PNB']
  },
  {
    name: 'IT',
    marketCap: 1800,
    topGainers: ['TCS'],
    topLosers: ['Wipro', 'Infosys']
  },
  {
    name: 'Pharma',
    marketCap: 900,
    topGainers: ['Sun Pharma'],
    topLosers: ['Cipla']
  },
  {
    name: 'FMCG',
    marketCap: 1500,
    topGainers: ['ITC'],
    topLosers: ['HUL']
  },
  {
    name: 'Metals',
    marketCap: 700,
    topGainers: ['Tata Steel'],
    topLosers: []
  },
  {
    name: 'Energy',
    marketCap: 1600,
    topGainers: ['Reliance'],
    topLosers: ['ONGC']
  },
  {
    name: 'Realty',
    marketCap: 400,
    topGainers: [],
    topLosers: ['DLF']
  },
  {
    name: 'Auto',
    marketCap: 1300,
    topGainers: ['Maruti'],
    topLosers: ['Tata Motors']
  },
  {
    name: 'PSU',
    marketCap: 800,
    topGainers: [],
    topLosers: ['BPCL', 'IOCL']
  },
  {
    name: 'Infrastructure',
    marketCap: 600,
    topGainers: ['L&T'],
    topLosers: []
  }
] 

/* API Fetch Function */
 async function fetchSectorPerformance (timeline, sectors) {
    try {
        const sectorParam = sectors.join(',')
        const response = await fetch(
            `/api/sector-heatmap?timeline=${timeline}&sectors=${sectorParam}`
        )
        const data = await response.json()
        return data.map(item => ({
            name: item.sector,
            change: item.changePercent,
            marketCap: item.marketCap,
            topGainers: [],
            topLosers: []
        }))
    } catch (error) {
        console.error('API error, using mock data', error)
        return baseSectorData.map(sector => ({
            ...sector,
            change: Number(((Math.random() * 2 - 1) * 3).toFixed(2))
        }))
    }
 }
        /* State */
        const sectorData = ref([])
        const selectedTimeframe = ref('1D')
        const sectorSearch = ref('')
        const sectorOptions = baseSectorData.map(s => s.name)
        const selectedSectors = ref([...sectorOptions]) 

        /* Timeframe Options */
        const timeframeOptions = [
            {label: '1D', value: '1D'},
            {label: '5D', value: '5D'},
            {label: '1M', value: '1M'},
            {label: '3m', value: '3M'},
            {label: '6M', value: '6M'},
            {label: '1Y', value: '1Y'}
    ]

    /* Watch Timeline & Sector Changes */
    watch(
        [selectedTimeframe, selectedSectors],
        async ([timeline, sectors]) => {
            if (!sectors.length) {
                sectorData.value = []
                return
            }
            sectorData.value = await fetchSectorPerformance(timeline,sectors)
        },
        { immediate: true }
    )

    /* Filtered Sector Options */
    const filteredSectorOptions = computed(() =>
    sectorOptions.filter(s =>
    s.toLowerCase().includes(sectorSearch.value.toLowerCase())
 )
)

/* Visible Sectors */
const visibleSectors = computed(() =>
sectorData.value.filter(s =>
    selectedSectors.value.includes(s.name)
 )
)

/* Market-cap Weighted Tile Size */
const maxMarketCap = computed(() =>
Math.max(...sectorData.value.map(s => s.marketCap), 1)
)
    
const tileStyle = (sector) => {
    const weight = sector.marketCap / maxMarketCap.value
    return {
        flexGrow: (weight * 3).toFixed(2),
        minWidth: '180px',
        height: '140px'
    }
}  
       
        /* Heat Color */
        const getHeatColor = (change) => {
            if (change >0) return 'heat-gain'
            if (change <0) return 'heat-loss'
            return 'heat-neutral'
        }

        /* Apply Search on Enter */
        function applySectorSearch () {
            const search = sectorSearch.value.trim().toLowerCase()

            if(!search) return

            const matched = sectorOptions.filter(s =>
                s.toLowerCase().includes(search)
            )
            if(matched.length) {
                selectedSectors.value = matched
            }
        }

         /* Reset */
        function resetFilters () {
            selectedTimeframe.value = '1D' 
              selectedSectors.value = [...sectorOptions]
              sectorSearch.value = ''
        }
    </script>

    <style scoped>
        .heat-map-grid {
            display: flex;
            flex-wrap:wrap;
            gap:12px;
        }

        .heat-title {
            border-radius: 12px;
            transition:transform 0.2s ease;
            cursor:pointer;
        }

        .heat-title:hover {
            transform: scale(1.05);
        }

        /* Heat Colors */
        .heat-gain {
            color: #81c784;
            background:#1b5e20;
        }
         .heat-neutral {
            color: #e0e0e0;
            background:#424242
        }
         .heat-loss {
            color: #ef9a9a;
            background: #b71c1c;
        }
    </style>
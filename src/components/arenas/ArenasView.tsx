'use client'

import AppSidebar from "../layout/AppSidebar"
import ArenasHero from "./ArenasHero"
import ArenasTable from "./ArenasTable"


export default function ArenasView() {
  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-white">
      <AppSidebar />
      <main className="flex-1 overflow-x-hidden">
        <ArenasHero />
        <ArenasTable />
      </main>
    </div>
  )
}

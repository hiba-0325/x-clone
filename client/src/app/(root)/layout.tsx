import Sidebar from "@/components/sidebar/left-sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return  <div className="flex h-screen text-white">
  
  
    <div ><Sidebar/>
    </div>
    <div className="flex-1 overflow-y-auto p-4"> {children} </div>
    </div>
}

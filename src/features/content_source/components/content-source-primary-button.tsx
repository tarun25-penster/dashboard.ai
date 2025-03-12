import { Button } from "@/components/ui/button";
import { FilePlus, Database } from "lucide-react";

export default function ContentSourcePrimaryButton({ onAddSource }: { onAddSource: () => void }) {
  return (
    
      <div className="flex gap-2">
        <Button variant="outline" className="space-x-1">
          <Database size={16} />
          <span>Import Source</span>
        </Button>
        <Button className="bg-gray-900 text-white space-x-1" onClick={onAddSource}>
          <FilePlus size={16} />
          <span>Add Source</span>
        </Button>
      </div>

  );
}

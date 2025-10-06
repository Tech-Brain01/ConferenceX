import { Label } from "./ui/label";
import { Button } from "./ui/Button";

const FilterBar = () => {
  return (
     <div className="flex gap-4 items-center mb-4 bg-indigo-100 p-3 rounded-xl" >
      <Label className="text-base">
        From:{" "}
        <input className="rounded-xl p-1" type="date"  />
      </Label>

      <Label className="text-base">
        To:{" "}
         <input className="rounded-xl p-1" type="date"  />
      </Label>

      <Button className="w-fit text-sm font-semibold rounded-full" variant="success" >Apply</Button>
      <Button className="w-fit text-sm font-semibold rounded-full" variant="warning">Reset</Button>
    </div>
  )
}

export default FilterBar
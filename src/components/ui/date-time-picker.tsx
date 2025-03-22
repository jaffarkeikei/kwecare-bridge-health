
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    date ? format(date, "HH:mm") : undefined
  )

  // Update the combined date when either date or time changes
  React.useEffect(() => {
    if (date && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setDate(newDate)
    }
  }, [date, selectedTime, setDate])

  const times = React.useMemo(() => {
    const timeOptions = []
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0')
        const formattedMinute = minute.toString().padStart(2, '0')
        timeOptions.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return timeOptions
  }, [])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Select value={selectedTime} onValueChange={setSelectedTime}>
        <SelectTrigger
          id="time"
          className={cn(!selectedTime && "text-muted-foreground")}
        >
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {selectedTime ? selectedTime : <span>Pick a time</span>}
          </div>
        </SelectTrigger>
        <SelectContent>
          {times.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

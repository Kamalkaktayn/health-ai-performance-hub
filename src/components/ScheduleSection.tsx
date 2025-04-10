
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  UserCog, 
  Pencil, 
  Trash2,
  Clock
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Professional } from "@/utils/dataTypes";
import { useToast } from "@/hooks/use-toast";

interface ScheduleSectionProps {
  professionals: Professional[];
}

interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  professionalId: string;
  type: 'review' | 'training' | 'meeting';
  notes?: string;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ professionals }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const savedEvents = localStorage.getItem('scheduleEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert date strings back to Date objects
        return parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
      } catch (error) {
        console.error("Error parsing saved events:", error);
        return [];
      }
    }
    return [];
  });
  
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<ScheduleEvent, 'id'>>({
    title: '',
    date: new Date(),
    professionalId: '',
    type: 'review',
    notes: ''
  });

  // Save events to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('scheduleEvents', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    const id = `event-${Date.now()}`;
    const eventToAdd = {
      id,
      ...newEvent
    };
    setEvents([...events, eventToAdd]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      date: new Date(),
      professionalId: '',
      type: 'review',
      notes: ''
    });

    toast({
      title: "Event Added",
      description: `${eventToAdd.title} has been scheduled for ${format(eventToAdd.date, 'PPP')}`,
      variant: "default"
    });
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    );
    
    setEvents(updatedEvents);
    setIsEditEventOpen(false);
    setSelectedEvent(null);

    toast({
      title: "Event Updated",
      description: "The scheduled event has been updated successfully",
      variant: "default"
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    
    toast({
      title: "Event Deleted",
      description: "The scheduled event has been removed",
      variant: "default"
    });
  };

  const eventDates = events.map(event => event.date);

  const eventsForSelectedDay = events.filter(event => 
    isSameDay(event.date, date)
  );

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'review': return 'blue';
      case 'training': return 'green';
      case 'meeting': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-t-4 border-t-healthcare-primary">
        <CardHeader className="bg-gradient-to-r from-healthcare-light to-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-healthcare-primary" />
                Performance Review Schedule
              </CardTitle>
              <CardDescription>Schedule and manage performance reviews and training</CardDescription>
            </div>
            <Button onClick={() => setIsAddEventOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border w-full"
                    modifiers={{
                      event: eventDates
                    }}
                    modifiersStyles={{
                      event: {
                        color: 'white',
                        backgroundColor: '#4c6ef5',
                        borderRadius: '50%'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-4">
              <h3 className="text-lg font-medium mb-4">
                {format(date, 'PPP')} - Events
              </h3>
              
              {eventsForSelectedDay.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500">No events scheduled for this day</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddEventOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {eventsForSelectedDay.map(event => {
                    const professional = professionals.find(p => p.id === event.professionalId);
                    const typeColor = getEventTypeColor(event.type);
                    
                    return (
                      <Card key={event.id} className={`border-l-4 border-l-${typeColor}-500`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <UserCog className="h-3.5 w-3.5 mr-1" />
                                {professional ? professional.name : 'Unknown Professional'}
                              </div>
                              <Badge variant="outline" className={`mt-2 bg-${typeColor}-100 text-${typeColor}-800 capitalize`}>
                                {event.type}
                              </Badge>
                              {event.notes && (
                                <p className="mt-2 text-sm text-gray-600">{event.notes}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setIsEditEventOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new schedule event for professional reviews or training.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Title
              </label>
              <Input 
                className="col-span-3" 
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Professional
              </label>
              <Select 
                value={newEvent.professionalId}
                onValueChange={(value) => setNewEvent({...newEvent, professionalId: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a professional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map(professional => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name} - {professional.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Type
              </label>
              <Select 
                value={newEvent.type}
                onValueChange={(value: 'review' | 'training' | 'meeting') => 
                  setNewEvent({...newEvent, type: value})
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Performance Review</SelectItem>
                  <SelectItem value="training">Training Session</SelectItem>
                  <SelectItem value="meeting">Team Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Date
              </label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => date && setNewEvent({...newEvent, date})}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium col-span-1">
                Notes
              </label>
              <Input 
                className="col-span-3" 
                placeholder="Additional notes (optional)"
                value={newEvent.notes || ''}
                onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.professionalId}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the scheduled event details.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium col-span-1">
                  Title
                </label>
                <Input 
                  className="col-span-3" 
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium col-span-1">
                  Professional
                </label>
                <Select 
                  value={selectedEvent.professionalId}
                  onValueChange={(value) => setSelectedEvent({...selectedEvent, professionalId: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a professional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map(professional => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name} - {professional.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium col-span-1">
                  Type
                </label>
                <Select 
                  value={selectedEvent.type}
                  onValueChange={(value: 'review' | 'training' | 'meeting') => 
                    setSelectedEvent({...selectedEvent, type: value})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review">Performance Review</SelectItem>
                    <SelectItem value="training">Training Session</SelectItem>
                    <SelectItem value="meeting">Team Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium col-span-1">
                  Date
                </label>
                <div className="col-span-3">
                  <Calendar
                    mode="single"
                    selected={selectedEvent.date}
                    onSelect={(date) => date && setSelectedEvent({...selectedEvent, date})}
                    className="rounded-md border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium col-span-1">
                  Notes
                </label>
                <Input 
                  className="col-span-3" 
                  value={selectedEvent.notes || ''}
                  onChange={(e) => setSelectedEvent({...selectedEvent, notes: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateEvent} 
              disabled={!selectedEvent || !selectedEvent.title || !selectedEvent.professionalId}
            >
              Update Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleSection;

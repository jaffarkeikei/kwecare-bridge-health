import React, { useState } from "react";
import { Search as SearchIcon, Send, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMessageTime } from "./utils/ui-helpers";
import { toast } from "sonner";

// Sample message data
const detailedMessages = [
  { id: 1, from: "Dr. Rebecca Taylor", subject: "Re: Treatment protocol for David Wilson", content: "I've reviewed the latest blood work for David Wilson. His cholesterol levels have improved but we should continue monitoring his blood pressure. The current medication seems to be working well, but we might need to adjust the dosage if symptoms persist. Could you schedule a follow-up appointment for next week?", time: "35 minutes ago", read: false, folder: "inbox" },
  { id: 2, from: "Nurse James White", subject: "Lab results for Sarah Johnson", content: "Attached are the lab results for Sarah Johnson. Her HbA1c is 7.2%, which is better than her last reading but still above target. I've scheduled a nutritionist consultation for her next week. Please review the complete results and let me know if any additional tests are needed at her next visit.", time: "2 hours ago", read: true, folder: "inbox" },
  { id: 3, from: "Community Health Worker", subject: "Visiting schedule for next week", content: "Here's the visiting schedule for community outreach next week. We'll be visiting the White River community on Tuesday and Thursday for diabetes education and wellness checks. Please let me know if you'd like to join or if there are specific patients you'd like us to check on during these visits.", time: "Yesterday", read: true, folder: "inbox" },
  { id: 4, from: "You", subject: "Follow-up appointment request", content: "Hi Sarah, Based on your recent test results, I'd like to schedule a follow-up appointment to discuss adjustments to your diabetes management plan. Please call the clinic to set up a time that works for you in the next two weeks.", time: "5 days ago", sent: true, to: "Patient - Sarah Johnson", folder: "sent" },
  { id: 5, from: "You", subject: "Community health initiative", content: "I'd like to propose a community health screening day focused on diabetes prevention for the White River community. Let's discuss logistics and potential dates during our next team meeting.", time: "1 week ago", sent: true, to: "Community Health Team", folder: "sent" },
];

const MessagesSection = () => {
  const [selectedMessageTab, setSelectedMessageTab] = useState("inbox");
  const [searchMessagesQuery, setSearchMessagesQuery] = useState("");
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [messageRecipient, setMessageRecipient] = useState("");
  const [messageSubject, setMessageSubject] = useState("");

  // Filter messages based on search query and selected folder
  const filteredMessages = detailedMessages
    .filter(message => 
      (selectedMessageTab === "all" || message.folder === selectedMessageTab) &&
      (searchMessagesQuery === "" || 
        message.subject.toLowerCase().includes(searchMessagesQuery.toLowerCase()) ||
        message.from.toLowerCase().includes(searchMessagesQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchMessagesQuery.toLowerCase()))
    );

  const handleSendMessage = () => {
    if (!messageRecipient) {
      toast.error("Please specify a recipient");
      return;
    }
    
    if (!messageSubject) {
      toast.error("Please enter a subject");
      return;
    }
    
    if (!messageContent) {
      toast.error("Please enter message content");
      return;
    }
    
    // In a real app, this would send the message to the server
    toast.success(`Message sent to ${messageRecipient}`);
    setShowComposeDialog(false);
    
    // Reset form
    setMessageRecipient("");
    setMessageSubject("");
    setMessageContent("");
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Secure Messaging</CardTitle>
            <CardDescription>
              Communicate with patients and healthcare team
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowComposeDialog(true)}>
              <Send className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-[600px] border rounded-md overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r flex flex-col">
            <Tabs 
              value={selectedMessageTab} 
              onValueChange={setSelectedMessageTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start border-b h-auto">
                <TabsTrigger 
                  value="inbox"
                  className="flex-1 data-[state=active]:bg-muted rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger 
                  value="sent"
                  className="flex-1 data-[state=active]:bg-muted rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Sent
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="p-2 border-b">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchMessagesQuery}
                  onChange={(e) => setSearchMessagesQuery(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-sm text-muted-foreground">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 border-b cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id 
                        ? 'bg-muted' 
                        : message.read || message.sent
                          ? 'hover:bg-muted/50' 
                          : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm flex items-center gap-1">
                        {!message.read && !message.sent && (
                          <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                        )}
                        {message.from}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(message.time)}
                      </span>
                    </div>
                    <p className="text-sm truncate">{message.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {message.content.substring(0, 60)}...
                    </p>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{selectedMessage.from}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedMessage.time}
                      </div>
                    </div>
                    {!selectedMessage.sent && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setShowComposeDialog(true);
                          setMessageContent(`\n\n---\nOn ${selectedMessage.time}, ${selectedMessage.from} wrote:\n> ${selectedMessage.content.split('\n').join('\n> ')}`);
                        }}
                      >
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-3xl mx-auto">
                    <p className="whitespace-pre-line">{selectedMessage.content}</p>
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h3 className="text-lg font-medium mb-2">No message selected</h3>
                <p className="text-muted-foreground mb-6">Select a message from the list to view its contents</p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowComposeDialog(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Compose New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Compose Message Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Write your message to patients or healthcare team members
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                To
              </Label>
              <Select
                value={messageRecipient}
                onValueChange={setMessageRecipient}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient-david">David Wilson (Patient)</SelectItem>
                  <SelectItem value="patient-sarah">Sarah Johnson (Patient)</SelectItem>
                  <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                  <SelectItem value="nurse-white">Nurse James White</SelectItem>
                  <SelectItem value="community-team">Community Health Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="col-span-3"
                placeholder="Enter message subject"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="content" className="text-right self-start pt-2">
                Message
              </Label>
              <Textarea
                id="content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="col-span-3"
                rows={10}
                placeholder="Type your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MessagesSection; 
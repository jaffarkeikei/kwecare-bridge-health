import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Check, Edit, Plus, Trash2, AlertCircle, Save, PlusCircle, Leaf, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Treatment plan types
type TreatmentCategory = 'medication' | 'lifestyle' | 'monitoring' | 'referral' | 'traditional' | 'follow-up';

interface TreatmentElement {
  id: string;
  category: TreatmentCategory;
  name: string;
  description: string;
  duration?: string;
  frequency?: string;
  traditionalKnowledge?: boolean;
  knowledgeSource?: string;
  followUpDate?: string;
  criticalElement?: boolean;
}

interface TreatmentPlanBuilderProps {
  patientId: string;
  patientName: string;
  conditions: string[];
  existingTreatments?: TreatmentElement[];
  onSave?: (plan: TreatmentElement[]) => void;
}

const TreatmentPlanBuilder: React.FC<TreatmentPlanBuilderProps> = ({
  patientId,
  patientName,
  conditions,
  existingTreatments = [],
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<TreatmentCategory>('medication');
  const [treatments, setTreatments] = useState<TreatmentElement[]>(existingTreatments);
  const [editingElement, setEditingElement] = useState<TreatmentElement | null>(null);
  
  // New element form state
  const [newElement, setNewElement] = useState<Partial<TreatmentElement>>({
    category: activeTab,
    traditionalKnowledge: false
  });
  
  // Handle adding new treatment element
  const handleAddElement = () => {
    if (!newElement.name || !newElement.description) {
      toast.error("Name and description are required");
      return;
    }
    
    const element: TreatmentElement = {
      id: `treatment-${Date.now()}`,
      category: activeTab,
      name: newElement.name,
      description: newElement.description,
      duration: newElement.duration,
      frequency: newElement.frequency,
      traditionalKnowledge: newElement.traditionalKnowledge || false,
      knowledgeSource: newElement.knowledgeSource,
      followUpDate: newElement.followUpDate,
      criticalElement: newElement.criticalElement || false
    };
    
    setTreatments([...treatments, element]);
    
    // Reset form
    setNewElement({
      category: activeTab,
      traditionalKnowledge: false
    });
    
    toast.success("Treatment element added");
  };
  
  // Handle editing existing element
  const handleEditElement = (id: string) => {
    const element = treatments.find(t => t.id === id);
    if (element) {
      setEditingElement(element);
      setActiveTab(element.category);
    }
  };
  
  // Handle updating edited element
  const handleUpdateElement = () => {
    if (!editingElement) return;
    
    setTreatments(treatments.map(t => 
      t.id === editingElement.id ? editingElement : t
    ));
    
    setEditingElement(null);
    toast.success("Treatment element updated");
  };
  
  // Handle deleting element
  const handleDeleteElement = (id: string) => {
    setTreatments(treatments.filter(t => t.id !== id));
    toast.success("Treatment element removed");
  };
  
  // Handle saving the entire treatment plan
  const handleSavePlan = () => {
    if (onSave) {
      onSave(treatments);
    }
    toast.success("Treatment plan saved");
  };
  
  // Get category display name
  const getCategoryLabel = (category: TreatmentCategory): string => {
    switch(category) {
      case 'medication': return 'Medication';
      case 'lifestyle': return 'Lifestyle';
      case 'monitoring': return 'Monitoring';
      case 'referral': return 'Referral';
      case 'traditional': return 'Traditional';
      case 'follow-up': return 'Follow-up';
      default: return category;
    }
  };
  
  // Filter treatments by category
  const filteredTreatments = treatments.filter(t => t.category === activeTab);
  
  // Render form for adding/editing treatment elements
  const renderElementForm = () => {
    const isEditing = !!editingElement;
    const formData = isEditing ? editingElement : newElement;
    
    return (
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-medium text-lg">
          {isEditing ? 'Edit Treatment Element' : `Add New ${getCategoryLabel(activeTab)}`}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => isEditing 
                ? setEditingElement({...editingElement, name: e.target.value})
                : setNewElement({...newElement, name: e.target.value})
              }
              placeholder={`${getCategoryLabel(activeTab)} name`}
            />
          </div>
          
          {(activeTab === 'medication' || activeTab === 'traditional') && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={formData.frequency || ''}
                onChange={(e) => isEditing 
                  ? setEditingElement({...editingElement, frequency: e.target.value})
                  : setNewElement({...newElement, frequency: e.target.value})
                }
                placeholder="e.g. Twice daily, Weekly"
              />
            </div>
          )}
          
          {(activeTab === 'medication' || activeTab === 'traditional' || activeTab === 'lifestyle') && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration || ''}
                onChange={(e) => isEditing 
                  ? setEditingElement({...editingElement, duration: e.target.value})
                  : setNewElement({...newElement, duration: e.target.value})
                }
                placeholder="e.g. 2 weeks, Ongoing"
              />
            </div>
          )}
          
          {activeTab === 'follow-up' && (
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <div className="relative">
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate || ''}
                  onChange={(e) => isEditing 
                    ? setEditingElement({...editingElement, followUpDate: e.target.value})
                    : setNewElement({...newElement, followUpDate: e.target.value})
                  }
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
          
          {activeTab === 'traditional' && (
            <div className="space-y-2">
              <Label htmlFor="knowledgeSource">Knowledge Source</Label>
              <Input
                id="knowledgeSource"
                value={formData.knowledgeSource || ''}
                onChange={(e) => isEditing 
                  ? setEditingElement({...editingElement, knowledgeSource: e.target.value})
                  : setNewElement({...newElement, knowledgeSource: e.target.value})
                }
                placeholder="e.g. Elder Margaret Francis"
              />
            </div>
          )}
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => isEditing 
                ? setEditingElement({...editingElement, description: e.target.value})
                : setNewElement({...newElement, description: e.target.value})
              }
              placeholder="Detailed instructions or notes"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
          {activeTab === 'traditional' && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="traditionalKnowledge" 
                checked={formData.traditionalKnowledge || false}
                onCheckedChange={(checked) => isEditing 
                  ? setEditingElement({...editingElement, traditionalKnowledge: !!checked})
                  : setNewElement({...newElement, traditionalKnowledge: !!checked})
                }
              />
              <Label htmlFor="traditionalKnowledge" className="text-sm font-normal cursor-pointer">
                Protected Traditional Knowledge
              </Label>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="criticalElement" 
              checked={formData.criticalElement || false}
              onCheckedChange={(checked) => isEditing 
                ? setEditingElement({...editingElement, criticalElement: !!checked})
                : setNewElement({...newElement, criticalElement: !!checked})
              }
            />
            <Label htmlFor="criticalElement" className="text-sm font-normal cursor-pointer">
              Mark as critical element
            </Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          {isEditing && (
            <Button variant="outline" onClick={() => setEditingElement(null)}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={isEditing ? handleUpdateElement : handleAddElement}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Update
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Plan
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Treatment Plan Builder: {patientName}</span>
          <div className="flex space-x-2">
            <Button onClick={handleSavePlan} className="gap-2">
              <Save className="h-4 w-4" />
              Save Plan
            </Button>
          </div>
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {conditions.map((condition, i) => (
            <Badge key={i} variant="secondary">
              {condition}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TreatmentCategory)} className="mb-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="medication">Medication</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="traditional">Traditional</TabsTrigger>
            <TabsTrigger value="referral">Referrals</TabsTrigger>
            <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Form for adding/editing treatment elements */}
        {renderElementForm()}
        
        {/* Display existing elements for the selected category */}
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-3">
            {getCategoryLabel(activeTab)} Plan Elements ({filteredTreatments.length})
          </h3>
          
          {filteredTreatments.length > 0 ? (
            <div className="space-y-3">
              {filteredTreatments.map((element) => (
                <div 
                  key={element.id} 
                  className={`p-4 rounded-lg border ${
                    element.traditionalKnowledge 
                      ? 'bg-green-50 border-green-200' 
                      : element.criticalElement 
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{element.name}</h4>
                        {element.criticalElement && (
                          <Badge className="bg-amber-100 text-amber-800">Critical</Badge>
                        )}
                        {element.traditionalKnowledge && (
                          <Badge className="bg-green-100 text-green-800">Traditional Knowledge</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mt-1">{element.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-sm">
                        {element.frequency && (
                          <div>
                            <span className="text-muted-foreground">Frequency: </span>
                            {element.frequency}
                          </div>
                        )}
                        
                        {element.duration && (
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            {element.duration}
                          </div>
                        )}
                        
                        {element.knowledgeSource && (
                          <div>
                            <span className="text-muted-foreground">Source: </span>
                            {element.knowledgeSource}
                          </div>
                        )}
                        
                        {element.followUpDate && (
                          <div>
                            <span className="text-muted-foreground">Follow-up: </span>
                            {element.followUpDate}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditElement(element.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteElement(element.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
              <p>No {getCategoryLabel(activeTab).toLowerCase()} elements added yet.</p>
              <p className="text-sm mt-1">Add elements using the form above.</p>
            </div>
          )}
        </div>
        
        {/* Special Traditional Knowledge Integration */}
        {activeTab === 'traditional' && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium flex items-center gap-2 text-green-800">
              <Leaf className="h-5 w-5 text-green-700" />
              Traditional Knowledge Integration Guidelines
            </h3>
            <div className="mt-3 text-sm text-green-800 space-y-2">
              <p>
                When documenting traditional knowledge:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Always attribute the source of knowledge (Elder, Knowledge Keeper)</li>
                <li>Flag protected knowledge that requires special permission for sharing</li>
                <li>Document how the traditional approach complements Western treatments</li>
                <li>Consider cultural implications and community-specific practices</li>
              </ul>
              <p className="mt-3 italic">
                Remember: Indigenous data sovereignty principles apply to all traditional knowledge recorded.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-3 border-green-300 text-green-800 bg-green-50 hover:bg-green-100"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Request Elder Consultation
            </Button>
          </div>
        )}
        
        {/* Integration Visualization */}
        {treatments.length > 0 && treatments.some(t => t.category === 'traditional') && treatments.some(t => t.category !== 'traditional') && (
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-3">Integrated Treatment Approach</h3>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg text-center">
                  <h4 className="font-medium text-blue-800">Western Medicine</h4>
                  <div className="text-sm mt-2 text-blue-700">
                    {treatments
                      .filter(t => t.category === 'medication')
                      .slice(0, 2)
                      .map(t => t.name)
                      .join(", ")}
                    {treatments.filter(t => t.category === 'medication').length > 2 && ", ..."}
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
                  <span className="text-xs font-medium">Integration</span>
                </div>
                
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg text-center">
                  <h4 className="font-medium text-green-800">Traditional Approaches</h4>
                  <div className="text-sm mt-2 text-green-700">
                    {treatments
                      .filter(t => t.category === 'traditional')
                      .slice(0, 2)
                      .map(t => t.name)
                      .join(", ")}
                    {treatments.filter(t => t.category === 'traditional').length > 2 && ", ..."}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-center">
                This treatment plan integrates both Western medicine and traditional Indigenous approaches,
                respecting cultural practices while providing comprehensive care.
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSavePlan} className="gap-2">
          <Save className="h-4 w-4" />
          Save Complete Treatment Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TreatmentPlanBuilder; 
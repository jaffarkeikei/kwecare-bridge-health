
import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  LogOut,
  Shield,
  CreditCard,
  HardDrive,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "@/App";
import Header from "@/components/ui/layout/Header";
import Footer from "@/components/ui/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, userType, setUserType } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("account");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const isProvider = userType === "provider";
  const displayName = isProvider ? "Dr. Michael Chen" : "Sarah Johnson";
  const email = isProvider ? "dr.chen@example.com" : "sarah.johnson@example.com";

  const handleLogout = () => {
    // Clear auth state and session storage
    setIsAuthenticated(false);
    setUserType(""); // Reset the user type
    
    // Clear all storage locations
    localStorage.removeItem("kwecare_session");
    localStorage.removeItem("kwecare_user_type");
    sessionStorage.removeItem("kwecare_session");
    sessionStorage.removeItem("kwecare_user_type");
    
    toast.success(`Successfully logged out of your ${userType} account`);
    navigate("/login");
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Settings | KweCare</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
        <Header />

        <main className="flex-1 pt-28 px-4 md:px-6 pb-16 w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 flex-shrink-0">
              <div className="sticky top-28">
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs 
                      orientation="vertical" 
                      value={activeTab} 
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="flex flex-col h-auto justify-start items-start gap-1 bg-transparent">
                        <TabsTrigger value="account" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                          <User className="h-4 w-4 mr-2" />
                          Account
                        </TabsTrigger>
                        <TabsTrigger value="security" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                          <Lock className="h-4 w-4 mr-2" />
                          Security
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                        </TabsTrigger>
                        {!isProvider && (
                          <TabsTrigger value="billing" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Billing
                          </TabsTrigger>
                        )}
                        <TabsTrigger value="preferences" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                          <Palette className="h-4 w-4 mr-2" />
                          Preferences
                        </TabsTrigger>
                        <TabsTrigger value="language" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                          <Globe className="h-4 w-4 mr-2" />
                          Language & Region
                        </TabsTrigger>
                        {isProvider && (
                          <TabsTrigger value="privacy" className="w-full justify-start px-3 data-[state=active]:bg-kwecare-primary/5 data-[state=active]:text-kwecare-primary">
                            <Shield className="h-4 w-4 mr-2" />
                            Privacy & Compliance
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </Tabs>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-500 text-lg">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Logout</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to log out of your {userType} account?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {isProvider ? (
                      <p className="text-xs text-red-500 mt-2">
                        Logging out will end your current session. Make sure you've saved any patient notes.
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 mt-2">
                        Logging out will end your current session. Your health data remains secure.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex-1">
              <TabsContent value="account" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your personal information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-kwecare-primary to-blue-400 flex items-center justify-center text-white text-xl font-semibold">
                          {displayName.split(" ").map(name => name[0]).join("")}
                        </div>
                        <div>
                          <h3 className="font-medium">{displayName}</h3>
                          <p className="text-sm text-muted-foreground">{email}</p>
                          <p className="text-xs text-kwecare-primary">
                            {isProvider ? "Healthcare Provider" : "Patient"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change profile picture
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue={displayName.split(" ")[0]} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue={displayName.split(" ")[1]} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>

                    {isProvider && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="specialty">Specialty</Label>
                            <Input id="specialty" defaultValue="Family Medicine" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="licenseNumber">License Number</Label>
                            <Input id="licenseNumber" defaultValue="MD123456" />
                          </div>
                        </div>
                      </div>
                    )}

                    {!isProvider && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyName">Contact Name</Label>
                            <Input id="emergencyName" defaultValue="Robert Johnson" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyPhone">Contact Phone</Label>
                            <Input id="emergencyPhone" defaultValue="+1 (555) 987-6543" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Input id="relationship" defaultValue="Spouse" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="branded">Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and privacy preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                      <Button className="mt-2" variant="outline">Change Password</Button>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-factor authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline">Setup 2FA</Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Setup Two-Factor Authentication</SheetTitle>
                              <SheetDescription>
                                Enhance your account security by enabling two-factor authentication.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label>Verification Method</Label>
                                <div className="grid grid-cols-1 gap-2">
                                  <Button variant="outline" className="justify-start">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Authenticator App
                                  </Button>
                                  <Button variant="outline" className="justify-start">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    SMS Text Message
                                  </Button>
                                  <Button variant="outline" className="justify-start">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Email
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <SheetFooter>
                              <Button variant="branded">Continue</Button>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Session Management</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Remember this device</Label>
                            <p className="text-sm text-muted-foreground">Stay signed in on this device</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Auto-logout after inactivity</Label>
                            <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Delete Account
                    </Button>
                    <Button variant="branded">Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Appointment Reminders</Label>
                            <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Health Records Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications when your health records are updated</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Medication Reminders</Label>
                            <p className="text-sm text-muted-foreground">Get reminders for medication schedules</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        {isProvider && (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Patient Updates</Label>
                              <p className="text-sm text-muted-foreground">Notifications about changes to patient status</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Newsletter and Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about new features and health tips</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">SMS Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Appointment Reminders</Label>
                            <p className="text-sm text-muted-foreground">Get SMS reminders for upcoming appointments</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Urgent Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive SMS for urgent health information</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="branded">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {!isProvider && (
                <TabsContent value="billing" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Information</CardTitle>
                      <CardDescription>Manage your payment methods and billing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Payment Methods</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 04/25</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                          <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Add Payment Method
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Billing Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="addressLine1">Address Line 1</Label>
                            <Input id="addressLine1" defaultValue="123 Main Street" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="addressLine2">Address Line 2</Label>
                            <Input id="addressLine2" defaultValue="Apt 4B" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" defaultValue="Toronto" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Province/State</Label>
                            <Input id="state" defaultValue="Ontario" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal/ZIP Code</Label>
                            <Input id="postalCode" defaultValue="M5V 2A8" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" defaultValue="Canada" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Billing History</h3>
                        <div className="overflow-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Nov 15, 2023</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Monthly Subscription</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">$25.00</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Paid
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Oct 15, 2023</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Monthly Subscription</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">$25.00</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Paid
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="branded">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="preferences" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Preferences</CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Theme</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-20 w-24 rounded-md bg-white border flex items-center justify-center">
                            <div className="h-12 w-16 bg-gray-200 rounded-md"></div>
                          </div>
                          <Label>Light</Label>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-20 w-24 rounded-md bg-gray-950 border border-gray-800 flex items-center justify-center">
                            <div className="h-12 w-16 bg-gray-800 rounded-md"></div>
                          </div>
                          <Label>Dark</Label>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-20 w-24 rounded-md bg-gradient-to-b from-white to-gray-950 border flex items-center justify-center">
                            <div className="h-12 w-16 bg-gradient-to-b from-gray-200 to-gray-800 rounded-md"></div>
                          </div>
                          <Label>System</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Dashboard Layout</h3>
                      <div className="flex gap-3">
                        <div className="space-y-2">
                          <div className="h-24 w-40 rounded-md bg-white border p-2">
                            <div className="h-1/4 w-full bg-gray-200 rounded-sm mb-2"></div>
                            <div className="grid grid-cols-2 gap-1 h-3/4">
                              <div className="bg-gray-200 rounded-sm"></div>
                              <div className="bg-gray-200 rounded-sm"></div>
                            </div>
                          </div>
                          <Label className="block text-center">Grid</Label>
                        </div>
                        <div className="space-y-2">
                          <div className="h-24 w-40 rounded-md bg-white border p-2">
                            <div className="h-1/4 w-full bg-gray-200 rounded-sm mb-2"></div>
                            <div className="space-y-1 h-3/4">
                              <div className="h-1/2 bg-gray-200 rounded-sm"></div>
                              <div className="h-1/2 bg-gray-200 rounded-sm"></div>
                            </div>
                          </div>
                          <Label className="block text-center">List</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Accessibility</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Larger Text</Label>
                            <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Reduced Motion</Label>
                            <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>High Contrast</Label>
                            <p className="text-sm text-muted-foreground">Improve visibility with higher contrast colors</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Reset to Default</Button>
                    <Button variant="branded">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="language" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Regional Settings</CardTitle>
                    <CardDescription>Customize your language and regional preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Language</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Display Language</Label>
                          <select id="language" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="cree">ᓀᐦᐃᔭᐍᐏᐣ (Cree)</option>
                            <option value="ojibwe">ᐊᓂᔑᓈᐯᒧᐎᓐ (Ojibwe)</option>
                            <option value="inuktitut">ᐃᓄᒃᑎᑐᑦ (Inuktitut)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Date and Time</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <select id="dateFormat" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeFormat">Time Format</Label>
                          <select id="timeFormat" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                            <option value="12h">12-hour (AM/PM)</option>
                            <option value="24h">24-hour</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Time Zone</Label>
                          <select id="timezone" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                            <option value="America/Toronto">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Vancouver">Pacific Time (PT) - Vancouver</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Measurements</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Units of Measurement</Label>
                            <p className="text-sm text-muted-foreground">Choose between metric and imperial units</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Label className="text-sm">Imperial</Label>
                            <Switch defaultChecked />
                            <Label className="text-sm">Metric</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="branded">Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {isProvider && (
                <TabsContent value="privacy" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Compliance</CardTitle>
                      <CardDescription>Manage privacy settings and healthcare compliance requirements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Data Sharing</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Share anonymized patient data for research</Label>
                              <p className="text-sm text-muted-foreground">Contribute to medical research with anonymized data</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow consultation with other providers</Label>
                              <p className="text-sm text-muted-foreground">Share patient information with other healthcare providers</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Compliance Documents</h3>
                        <div className="space-y-3">
                          <Collapsible className="w-full">
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-3">
                                <HardDrive className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">HIPAA Compliance Certificate</p>
                                  <p className="text-sm text-muted-foreground">Updated Oct 15, 2023</p>
                                </div>
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="p-3 border-x border-b rounded-b-md">
                              <p className="text-sm mb-2">Your HIPAA compliance certificate is up to date and valid until October 15, 2024.</p>
                              <Button variant="outline" size="sm">Download Certificate</Button>
                            </CollapsibleContent>
                          </Collapsible>

                          <Collapsible className="w-full">
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-3">
                                <HardDrive className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="font-medium">Privacy Policy Acknowledgment</p>
                                  <p className="text-sm text-muted-foreground">Updated Jan 5, 2023</p>
                                </div>
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="p-3 border-x border-b rounded-b-md">
                              <p className="text-sm mb-2">Your acknowledgment of the current privacy policy is on file.</p>
                              <Button variant="outline" size="sm">View Policy</Button>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Audit Logs</h3>
                        <div className="overflow-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Nov 15, 2023</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Record Access</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Sarah Johnson</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Viewed medical history</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Nov 14, 2023</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Prescription Update</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">David Wilson</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">Added new prescription</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Download Audit Log</Button>
                      <Button variant="branded">Save Settings</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Settings;

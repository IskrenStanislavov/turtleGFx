#!/usr/bin/python
#
#    Copyright 2010   Andy Shelley <andy@andyshelley.co.uk>
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program; if not, write to the Free Software
#    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

from Tkinter import *
from math import *

class Application (Frame):
    # initialise
    def __init__ (self, master=None):
        Frame.__init__ (self, master)
        self.grid ()
        self.createWidgets ()
	
    # create the dialog window
    def createWidgets (self): 
        self.EntryFrame = Frame (self,bd=5)
        self.EntryFrame.grid (row=0, column=1)       
        self.lbl1 = Label (self.EntryFrame, text='Curve Parameters')
        self.lbl1.grid (row=0, column=0, columnspan=2)        
        self.lbl2 = Label (self.EntryFrame, text='Recursion Level')
        self.lbl2.grid (row=1, column=0)
        self.BlocksVar = StringVar()
        self.Blocks = Entry (self.EntryFrame, textvariable=self.BlocksVar ,width=11)
        self.BlocksVar.set ('5')        
        self.Blocks.grid (row=1, column=1)
        self.lbl3 = Label (self.EntryFrame, text='Length of Panel')
        self.lbl3.grid (row=2, column=0)
        self.SizeVar = StringVar ()
        self.Size = Entry (self.EntryFrame, textvariable=self.SizeVar ,width=11)
        self.SizeVar.set ('248.0')        
        self.Size.grid (row=2, column=1)
        self.lbl4 = Label (self.EntryFrame, text='Depth of Cut')
        self.lbl4.grid (row=3, column=0)
        self.DepthVar = StringVar ()
        self.Depth = Entry (self.EntryFrame, textvariable=self.DepthVar ,width=11)
        self.DepthVar.set ('1.0')        
        self.Depth.grid (row=3, column=1)        
        self.lbl5 = Label (self.EntryFrame, text='Feed Rate')
        self.lbl5.grid (row=4, column=0)
        self.FeedVar = StringVar ()
        self.Feed = Entry (self.EntryFrame, textvariable=self.FeedVar ,width=11)
        self.FeedVar.set ('400')        
        self.Feed.grid (row=4, column=1)	
        self.lbl6 = Label (self.EntryFrame, text='Units')
        self.lbl6.grid (row=5, column=0)        
        self.UnitsVar = IntVar ()
        Radiobutton (self.EntryFrame, text='mm', value=0, variable=self.UnitsVar)\
            .grid (row=5, column=1, sticky = W)
        Radiobutton (self.EntryFrame, text='in', value=1, variable=self.UnitsVar)\
            .grid (row=5, column=1, sticky = E)
        self.quitButton = Button (self, text='Generate Path',\
                command=self.Gcode)
        self.quitButton.grid (row=6, column=1, sticky=S)
	
    # calculate Hilbert curve, using recursion
    def Hilbert (self, ca, level, angle, size, feed): 
		if level == 0:
			return	
		ca = (ca + 360 - angle) % 360
		self.Hilbert (ca, level - 1, -angle, size, feed)
		# if (ca == 0):
		# 	print "G1 X" + size + " Y0.0" + " F" + feed
		# elif (ca == 90):
		# 	print "G1 X0.0 Y-" + size + " F" + feed
		# elif (ca == 180):
		# 	print "G1 X-" + size +" Y0.0" + " F" + feed
		# else:
		# 	print "G1 X0.0 Y" + size + " F" + feed	
		ca = (ca + angle) % 360
		self.Hilbert (ca, level - 1, angle, size, feed)
		# if (ca == 0):
		# 	print "G1 X" + size + " Y0.0" + " F" + feed
		# elif (ca == 90):
		# 	print "G1 X0.0 Y-" + size + " F" + feed
		# elif (ca == 180):
		# 	print "G1 X-" + size +" Y0.0" + " F" + feed
		# else:
		# 	print "G1 X0.0 Y" + size + " F" + feed	
		self.Hilbert (ca, level - 1, angle, size, feed)
		ca = (ca + angle) % 360
		# if (ca == 0):
		# 	print "G1 X" + size + " Y0.0" + " F" + feed
		# elif (ca == 90):
		# 	print "G1 X0.0 Y-" + size + " F" + feed
		# elif (ca == 180):
		# 	print "G1 X-" + size +" Y0.0" + " F" + feed
		# else:
		# 	print "G1 X0.0 Y" + size + " F" + feed	
		self.Hilbert (ca, level - 1, -angle, size, feed)
		ca = (ca + 360 - angle) % 360
	
    # generate the gcode
    def Gcode (self): 
        # get the parameters
        self.Blocks = int (self.BlocksVar.get ())
        self.Size = float (self.SizeVar.get ())
        self.Depth = float (self.DepthVar.get ())
		self.Feed = float (self.FeedVar.get ())
	        self.Units = int (self.UnitsVar.get ())	
		# sanitise the inputs
		if (self.Blocks < 2):
			self.Blocks = 2
		if (self.Blocks > 10):
			self.Blocks = 10
		if (self.Size < 0):
			self.Size *= -1
		if (self.Depth < 0):
			self.Depth *= -1
		self.Depth = str(self.Depth)
		if (self.Feed < 0):
			self.Feed *= -1
		self.Feed = str(round (self.Feed, 1))
		# calculate the length of the sides
		self.Side = str (round (self.Size / ((2 ** self.Blocks) - 1), 3))
		# preamble
		print "G17 G40 G61 G91"	
		print "G94"
		# select metric or imperial units	
		if (self.Units == 0): 
		   print "G21"
		else : 
		   print "G20"	
		# feed endmill to depth   
		print "G0 Z0.0"
		print "G1 Z-" + self.Depth + " F" + self.Feed
		# trace curve
		self.Hilbert (0, self.Blocks, 90, self.Side, self.Feed) 
		# retract tool
		print "G1 Z" + self.Depth + " F" + self.Feed
		# end
		print "M30"	
		self.quit()

app = Application ()
app.master.title ("Hilbert Curve")
app.master.geometry ("300x200+300+200")
app.mainloop ()        
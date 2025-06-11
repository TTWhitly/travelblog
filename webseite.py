import webseite.webseite as webseite 
import sys
import os
import logging

def main():
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Create the main window
    main_window = webseite.Webseite()
    
    # Show the main window
    main_window.show()

if __name__ == "__main__":
    # Ensure the script is run in the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Call the main function to start the application
    main()
    # Ensure the script is run with the correct encoding
    sys.stdout.reconfigure(encoding='utf-8')

# Note: The above code assumes that the 'webseite' module is correctly implemented
# and contains a class named 'Webseite' that inherits from a Qt widget.
# This class should handle the GUI and functionality of the application.


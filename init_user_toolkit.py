#!/usr/bin/env python3
"""
User Toolkit Initialization Script
===================================
This script personalizes the toolkit configuration for multi-user lab environments.
Each user runs this script once to generate unique toolkit and business object IDs.

Usage:
    python init_user_toolkit.py

The script will:
1. Prompt for username and user ID
2. Update toolkit.config.json with unique values
3. Regenerate all business object class IDs in baw_custom_types.json
4. Create backups of original files
"""

import json
import uuid
import shutil
from pathlib import Path
from datetime import datetime


class ToolkitInitializer:
    """Handles toolkit initialization for individual users."""
    
    TOOLKIT_CONFIG = "toolkit.config.json"
    CUSTOM_TYPES = "toolkit_packager/baw_custom_types.json"
    
    def __init__(self):
        self.username = None
        self.user_id = None
        self.toolkit_guid = None
        
    def backup_files(self):
        """Create backups of configuration files."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        for filepath in [self.TOOLKIT_CONFIG, self.CUSTOM_TYPES]:
            if Path(filepath).exists():
                backup_path = f"{filepath}.backup_{timestamp}"
                shutil.copy2(filepath, backup_path)
                print(f"✅ Backed up: {filepath} → {backup_path}")
    
    def get_user_input(self):
        """Prompt user for their information."""
        print("\n" + "="*60)
        print("  BAW Toolkit User Initialization")
        print("="*60)
        print("\nThis script will personalize your toolkit configuration.")
        print("Each user in the lab must have unique values.\n")
        
        # Get username
        while True:
            self.username = input("Enter your username (e.g., Alice, Bob): ").strip()
            if self.username:
                break
            print("❌ Username cannot be empty. Please try again.")
        
        # Get user ID
        while True:
            try:
                user_id_input = input("Enter your user ID (1-99): ").strip()
                self.user_id = int(user_id_input)
                if 1 <= self.user_id <= 99:
                    break
                print("❌ User ID must be between 1 and 99. Please try again.")
            except ValueError:
                print("❌ Please enter a valid number.")
        
        # Generate unique toolkit GUID
        self.toolkit_guid = str(uuid.uuid4())
        
        print(f"\n📋 Configuration Summary:")
        print(f"   Username: {self.username}")
        print(f"   User ID: {self.user_id}")
        print(f"   Toolkit GUID: {self.toolkit_guid}")
        
        confirm = input("\nProceed with initialization? (yes/no): ").strip().lower()
        return confirm in ['yes', 'y']
    
    def update_toolkit_config(self):
        """Update toolkit.config.json with user-specific values."""
        print(f"\n🔧 Updating {self.TOOLKIT_CONFIG}...")
        
        try:
            with open(self.TOOLKIT_CONFIG, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Update toolkit metadata
            config['toolkit']['name'] = f"Custom Widgets - {self.username}"
            config['toolkit']['shortName'] = f"CW_{self.user_id}"
            config['toolkit']['description'] = f"Custom widget toolkit for {self.username}"
            config['toolkit']['id'] = f"2066.{self.toolkit_guid}"
            config['toolkit']['version'] = "1.0.0"  # Reset version for new user
            
            # Update output filename
            config['output']['filename'] = f"Custom_Widgets_{self.username}_{{version}}.twx"
            
            # Write updated config
            with open(self.TOOLKIT_CONFIG, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
            
            print(f"   ✅ Toolkit name: {config['toolkit']['name']}")
            print(f"   ✅ Toolkit shortName: {config['toolkit']['shortName']}")
            print(f"   ✅ Toolkit ID: {config['toolkit']['id']}")
            
            return True
            
        except FileNotFoundError:
            print(f"   ❌ Error: {self.TOOLKIT_CONFIG} not found!")
            return False
        except json.JSONDecodeError as e:
            print(f"   ❌ Error: Invalid JSON in {self.TOOLKIT_CONFIG}: {e}")
            return False
        except Exception as e:
            print(f"   ❌ Unexpected error: {e}")
            return False
    
    def update_custom_types(self):
        """Regenerate all business object class IDs."""
        print(f"\n🔧 Updating {self.CUSTOM_TYPES}...")
        
        try:
            with open(self.CUSTOM_TYPES, 'r', encoding='utf-8') as f:
                custom_types = json.load(f)
            
            # Update description
            custom_types['description'] = f"Custom Business Object Type Mappings for {self.username}"
            
            # Regenerate all class IDs
            regenerated_count = 0
            for type_name, type_data in custom_types.get('custom_types', {}).items():
                old_class_id = type_data.get('classId', '')
                new_guid = str(uuid.uuid4())
                new_class_id = f"/12.{new_guid}"
                type_data['classId'] = new_class_id
                
                # Update creation timestamp
                type_data['created'] = datetime.utcnow().isoformat() + 'Z'
                type_data['user'] = self.username
                
                regenerated_count += 1
                print(f"   ✅ {type_name}: {old_class_id} → {new_class_id}")
            
            # Update notes
            if 'notes' not in custom_types:
                custom_types['notes'] = {}
            custom_types['notes']['initialized_by'] = self.username
            custom_types['notes']['initialized_at'] = datetime.utcnow().isoformat() + 'Z'
            custom_types['notes']['user_id'] = self.user_id
            
            # Write updated custom types
            with open(self.CUSTOM_TYPES, 'w', encoding='utf-8') as f:
                json.dump(custom_types, f, indent=2)
            
            print(f"\n   ✅ Regenerated {regenerated_count} business object class IDs")
            
            return True
            
        except FileNotFoundError:
            print(f"   ❌ Error: {self.CUSTOM_TYPES} not found!")
            return False
        except json.JSONDecodeError as e:
            print(f"   ❌ Error: Invalid JSON in {self.CUSTOM_TYPES}: {e}")
            return False
        except Exception as e:
            print(f"   ❌ Unexpected error: {e}")
            return False
    
    def run(self):
        """Execute the initialization process."""
        print("\n" + "🚀 BAW Toolkit User Initialization Script")
        print("="*60)
        
        # Check if files exist
        if not Path(self.TOOLKIT_CONFIG).exists():
            print(f"\n❌ Error: {self.TOOLKIT_CONFIG} not found!")
            print("   Please run this script from the project root directory.")
            return False
        
        if not Path(self.CUSTOM_TYPES).exists():
            print(f"\n❌ Error: {self.CUSTOM_TYPES} not found!")
            print("   Please ensure the toolkit_packager directory exists.")
            return False
        
        # Get user input
        if not self.get_user_input():
            print("\n❌ Initialization cancelled by user.")
            return False
        
        # Create backups
        print("\n📦 Creating backups...")
        self.backup_files()
        
        # Update configuration files
        success = True
        success = self.update_toolkit_config() and success
        success = self.update_custom_types() and success
        
        if success:
            print("\n" + "="*60)
            print("✅ Toolkit initialization completed successfully!")
            print("="*60)
            print(f"\nYour toolkit is now configured for: {self.username} (ID: {self.user_id})")
            print("\nNext steps:")
            print("1. Package your toolkit: python toolkit_packager/package_toolkit.py")
            print("2. Deploy to BAW environment")
            print("3. Start building your custom widgets!")
            print("\n⚠️  Important: Do NOT commit these personalized config files to git")
            print("   Each user should run this script to generate their own configs.")
            return True
        else:
            print("\n" + "="*60)
            print("❌ Initialization failed!")
            print("="*60)
            print("\nPlease check the error messages above and try again.")
            print("Your original files have been backed up.")
            return False


def main():
    """Main entry point."""
    initializer = ToolkitInitializer()
    success = initializer.run()
    
    if not success:
        exit(1)


if __name__ == "__main__":
    main()

# Made with Bob

import imaplib
import os
import base64
import requests
import sys

# Configuration from environment variables
username = os.getenv('GMAIL_USER')
password = os.getenv('GMAIL_PASS')
github_token = os.getenv('GH_TOKEN')
repo = os.getenv('GITHUB_REPOSITORY')
target_sender = "paragthedev@gmail.com"
target_subject = "add bhajan"
folder_path = "temp"

def get_file_count():
    """Fetch the number of files in the folder via GitHub API."""
    url = f"https://api.github.com/repos/{repo}/contents/{folder_path}"
    headers = {"Authorization": f"token {github_token}"}
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            files = response.json()
            # Returns total count of .txt files
            return len([f for f in files if f['name'].endswith('.txt')])
        elif response.status_code == 404:
            return 0 
        else:
            print(f"Error fetching file count: {response.status_code}")
            return 0
    except Exception as e:
        print(f"Request to GitHub API failed: {e}")
        return 0

def create_github_file(filename):
    """Create a new file directly in the repo using the API."""
    url = f"https://api.github.com/repos/{repo}/contents/{folder_path}/{filename}"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    content = base64.b64encode(b"Email trigger processed and marked as read.").decode("utf-8")
    data = {
        "message": f"Automated log: {filename}",
        "content": content,
        "branch": "main"
    }
    
    try:
        response = requests.put(url, headers=headers, json=data)
        return response.status_code == 201
    except Exception as e:
        print(f"Error during GitHub file creation: {e}")
        return False

def send_reply(original_msg):
    """Sends a thumbs-up reply to the sender."""
    try:
        reply = EmailMessage()
        reply['Subject'] = f"Re: {original_msg['Subject']}"
        reply['To'] = original_msg['From']
        reply['From'] = username
        reply['In-Reply-To'] = original_msg['Message-ID']
        reply['References'] = original_msg['Message-ID']
        reply.set_content("👍 The file has been successfully created in the repository.")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(username, password)
            smtp.send_message(reply)
        print(f"Reply sent to {original_msg['From']}")
    except Exception as e:
        print(f"Failed to send reply: {e}")

def main():
    mail = None
    try:
        print("Connecting to Gmail...")
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        # Search for UNSEEN emails
        search_query = f'(UNSEEN FROM "{target_sender}" SUBJECT "{target_subject}")'
        status, messages = mail.search(None, search_query)
        
        if status != 'OK':
            print(f"Error searching mailbox: {status}")
            return

        email_ids = messages[0].split()
        
        if email_ids:
            print(f"Found {len(email_ids)} new matching emails.")
            
            for e_id in email_ids:
                # Fetch email details to get Subject and Message-ID for the reply
                _, msg_data = mail.fetch(e_id, '(RFC822)')
                import email
                msg = email.message_from_bytes(msg_data[0][1])
                subject = msg['Subject']

                if subject.startswith("Re:") or subject.startswith("Fwd:"):
                    print("This is a reply or forward. Skipping file creation.")
                    mail.store(e_id, '+FLAGS', '\\Seen') # Mark as read so we don't check it again
                    continue
                  
                # 1. Get current file count
                current_count = get_file_count()
                new_filename = f"{current_count + 1}.txt"
                
                # 2. Create the file in GitHub
                success = create_github_file(new_filename)
                
                if success:
                    print(f"Created {new_filename}. Now marking email {e_id.decode()} as read...")
                    # 3. Mark as read only if file creation was successful
                    mail.store(e_id, '+FLAGS', '\\Seen')
                    send_reply(msg)
                else:
                    print(f"Skipping mark-as-read for email {e_id.decode()} due to GitHub error.")
        else:
            print("No new matching emails found.")

    except imaplib.IMAP4.error as e:
        print(f"Gmail Authentication/IMAP Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)
    finally:
        if mail:
            try:
                mail.close()
                mail.logout()
                print("Connection closed.")
            except:
                pass

if __name__ == "__main__":
    main()

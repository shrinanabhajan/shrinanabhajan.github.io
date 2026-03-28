import imaplib
import os
import base64
import requests
import sys
import smtplib
import time
import email
from email.message import EmailMessage

# Configuration from environment variables
username = os.getenv('GMAIL_USER')
password = os.getenv('GMAIL_PASS')
github_token = os.getenv('GH_TOKEN')
repo = os.getenv('GITHUB_REPOSITORY')
target_senders = ["nanadaas@gmail.com", "nanamaharajtaranekar@gmail.com", "shrinanabhajan@gmail.com"]
target_subject = "add bhajan"
folder_path = "bhajans/b1"

def get_email_body(msg):
    """Extracts the plain text body from an email message."""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            if content_type == "text/plain" and "attachment" not in content_disposition:
                return part.get_payload(decode=True).decode()
    else:
        return msg.get_payload(decode=True).decode()
    return ""

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

def create_github_file(filename, file_content):
    """Create a new file directly in the repo using the API."""
    url = f"https://api.github.com/repos/{repo}/contents/{folder_path}/{filename}"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # Encode the extracted email body to base64
    encoded_content = base64.b64encode(file_content.encode("utf-8")).decode("utf-8")
    
    data = {
        "message": f"Automated log: {filename}",
        "content": encoded_content,
        "branch": "main"
    }
    
    try:
        response = requests.put(url, headers=headers, json=data)
        return response.status_code == 201
    except Exception as e:
        print(f"Error during GitHub file creation: {e}")
        return False

def send_reply(original_msg, bhajan_number):
    """Sends a thumbs-up reply to the sender."""
    try:
        reply = EmailMessage()
        reply['Subject'] = f"Re: {original_msg['Subject']}"
        reply['To'] = original_msg['From']
        reply['From'] = username
        reply['In-Reply-To'] = original_msg['Message-ID']
        reply['References'] = original_msg['Message-ID']
        reply.set_content(f"👍 The bhajan has been successfully added to the repository.\nCheck out https://shrinanabhajan.github.io/bhajan.html?b=b1-{bhajan_number}")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(username, password)
            print("Waiting 120 seconds before sending replying to email...")
            time.sleep(120)
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
        # This creates a nested OR string dynamically
        senders_query = f'FROM "{target_senders[-1]}"'
        for sender in reversed(target_senders[:-1]):
            senders_query = f'OR FROM "{sender}" ({senders_query})'
        
        search_query = f'(UNSEEN ({senders_query}) SUBJECT "{target_subject}")'
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

                # Extract the actual email body
                email_body = get_email_body(msg)
                
                if not email_body.strip():
                    print(f"Email {e_id.decode()} is empty. Skipping.")
                    continue
                
                # 1. Get current file count
                current_count = get_file_count()
                new_filename = f"{current_count + 1}.txt"
                
                # 2. Create the file in GitHub
                success = create_github_file(new_filename, email_body)
                
                if success:
                    print(f"Created {new_filename}. Now marking email {e_id.decode()} as read...")
                    # 3. Mark as read only if file creation was successful
                    mail.store(e_id, '+FLAGS', '\\Seen')
                    send_reply(msg, current_count + 1)
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

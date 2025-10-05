import { getAuthorUsername } from './getAuthorUsername';
import { getLinkedInPostUrl } from './getPostUrl';
import { sampleFunction } from '@src/sample-function';

console.log('[CEB] All content script loaded 1');

void sampleFunction();

// --- Add below ---

// Get the full URL for the icon
const iconUrl = chrome.runtime.getURL('icon-32.png');

// Create the '+' button element
const plusBtn = document.createElement('button');
plusBtn.style.position = 'absolute';
plusBtn.style.zIndex = '9999';
plusBtn.style.display = 'none';
plusBtn.style.width = '34px';
plusBtn.style.height = '34px';
plusBtn.style.padding = '0';
plusBtn.style.borderRadius = '50%';
plusBtn.style.background = `#0073b1 url('${iconUrl}') center/20px 20px no-repeat`;
plusBtn.style.color = '#fff';
plusBtn.style.border = 'none';
plusBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
document.body.appendChild(plusBtn);

// Create the 'saved!' message element
const savedMsg = document.createElement('div');
savedMsg.textContent = 'saved!';
savedMsg.style.position = 'absolute';
savedMsg.style.zIndex = '9999';
savedMsg.style.display = 'none';
savedMsg.style.padding = '6px 14px';
savedMsg.style.borderRadius = '8px';
savedMsg.style.background = '#0073b1';
savedMsg.style.color = '#fff';
savedMsg.style.fontWeight = 'bold';
savedMsg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
savedMsg.style.transition = 'opacity 0.3s';
savedMsg.style.opacity = '0';
document.body.appendChild(savedMsg);

// Remove selectionchange listener
// Add mouseup listener for showing the button
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    // Center X of selection
    const centerX = rect.left + rect.width / 2;
    // Position above selection, centered horizontally and vertically
    plusBtn.style.display = 'block';
    // Wait for button to render so offsetWidth/offsetHeight are available
    setTimeout(() => {
      plusBtn.style.top = `${window.scrollY + rect.top - plusBtn.offsetHeight - 8}px`;
      plusBtn.style.left = `${window.scrollX + centerX - plusBtn.offsetWidth / 2}px`;
    }, 0);
  } else {
    plusBtn.style.display = 'none';
  }
});

const getUserAuth = (): Promise<{ email: string | null; uid: string | null }> =>
  new Promise(resolve => {
    chrome.storage.local.get(['theme-storage-key'], result => {
      const theme = result['theme-storage-key'];
      resolve({
        email: theme && theme.email ? theme.email : null,
        uid: theme && theme.uid ? theme.uid : null,
      });
    });
  });

const uploadTextToFirebase = (email: string, uid: string, text: string, postUrl?: string, authorUsername?: string) => {
  console.log('Uploading text and postUrl to Firebase');
  chrome.runtime.sendMessage({ type: 'UPLOAD_TEXT', email, uid, text, postUrl, authorUsername }, response => {
    console.log('Upload response:', response);
  });
};

const AUTH_URL = 'https://surface-up.web.app/'; // Must match popup.tsx

plusBtn.addEventListener('click', async () => {
  plusBtn.style.transition = 'opacity 0.3s';
  plusBtn.style.opacity = '0';
  // Save the button position for centering the popup
  const btnTop = plusBtn.style.top;
  const btnLeft = plusBtn.style.left;

  // Get highlighted text
  const selection = window.getSelection();
  const text = selection ? selection.toString().trim() : '';
  // Get post URL from selection
  let postUrl = getLinkedInPostUrl(selection?.anchorNode ?? null);
  console.log('postUrl:', postUrl);
  if (postUrl == null) postUrl = undefined;

  // Get user email and uid from storage
  const { email, uid } = await getUserAuth();
  if (!email || !uid) {
    window.open(AUTH_URL, '_blank');
    return;
  }
  if (text) {
    // Get author username from selection
    const authorUsername = getAuthorUsername(selection?.anchorNode ?? null);
    // Upload text, postUrl and authorUsername to Firebase
    uploadTextToFirebase(email, uid, text, postUrl, authorUsername);
  }

  setTimeout(() => {
    plusBtn.style.display = 'none';
    savedMsg.style.display = 'block';
    setTimeout(() => {
      savedMsg.style.top = btnTop;
      savedMsg.style.left = `${parseFloat(btnLeft) + (plusBtn.offsetWidth - savedMsg.offsetWidth) / 2}px`;
      savedMsg.style.opacity = '1';
    }, 0);
    setTimeout(() => {
      savedMsg.style.opacity = '0';
      setTimeout(() => {
        savedMsg.style.display = 'none';
        plusBtn.style.opacity = '1';
      }, 300);
    }, 1200);
  }, 300);
});

import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function injectRephraseButton() {
  const messageBox = document.querySelector('textarea#custom-message');

  if (messageBox && !document.getElementById('rephrase-btn')) {
    const rephraseBtn = document.createElement('button');
    rephraseBtn.id = 'rephrase-btn';
    rephraseBtn.textContent = 'Rephrase';
    rephraseBtn.style.margin = '5px';
    rephraseBtn.style.padding = '5px 10px';
    rephraseBtn.style.backgroundColor = '#0073b1';
    rephraseBtn.style.color = 'white';
    rephraseBtn.style.border = 'none';
    rephraseBtn.style.cursor = 'pointer';

    messageBox.parentNode.appendChild(rephraseBtn);

    rephraseBtn.addEventListener('click', async () => {
      const originalText = messageBox.value;
      if (originalText.trim()) {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'developer',
              content:
                '"Rephrase the given LinkedIn connection message to be concise, professional, and engaging. Focus on making it clear that the user is interested in a job opportunity while adding a strong hook to capture attention. Maintain a friendly yet formal tone, highlighting interest in the role without sounding overly formal or generic. Dont go over 300 character limit"',
            },
            {
              role: 'user',
              content: originalText,
            },
          ],
          model: 'gpt-4',
        });

        messageBox.value = completion.choices[0].message.content.trim();
      }
    });
  }
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      // Check if the new node contains the message box
      if (node.nodeType === Node.ELEMENT_NODE) {
        // You can refine the selector as needed
        if (node.matches('textarea[name="message"]') || node.querySelector('textarea[name="message"]')) {
          injectRephraseButton();
        }
      }
    });
  });
});

// Start observing the document body for added nodes
observer.observe(document.body, {
  childList: true,
  subtree: true
});


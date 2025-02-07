(function () {
  function addRephraseButton() {
    const messageBox = document.querySelector('textarea#custom-message');

    if (messageBox) {
      console.log('Message box found');
    }
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
          const response = await fetch(
            'https://api.openai.com/v1/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer YOUR_OPENAI_API_KEY',
              },
              body: JSON.stringify({
                model: 'gpt-4',
                prompt: `Rephrase this professionally: ${originalText}`,
                max_tokens: 100,
              }),
            }
          );

          const data = await response.json();
          messageBox.value = data.choices[0].text.trim();
        }
        console.log(originalText);
      });
    }
  }

  setInterval(addRephraseButton, 3000); // Check for message box every 3 seconds
})();

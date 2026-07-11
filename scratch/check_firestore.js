async function run() {
  try {
    const url = 'https://firestore.googleapis.com/v1/projects/email-faq-help-bot-f56a0/databases/(default)/documents/settings/gmail';
    const res = await fetch(url);
    if (!res.ok) {
      console.log('Error fetching document:', res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log('Document data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
run();

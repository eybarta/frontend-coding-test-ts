# Frontend Coding Challenge [by Eyal Barta]

This is a minimal demo project for the frontend coding challenge.

### Flow

- API call to retrieve random cat fact (unfortunately the public api doesn't produce very random results)
- Once the fact is retrieved, it's displayed in the UI
- Then another call is made to a netlify function that is used to call openAI and generate an image, using the fact as prompt.
- The user can click on the image to get a catty response.
- The user can click on buttons to show next/last cat fact.

### Caveats
- Currently only 5 facts are retrieved.
- The openAI calls are to the dall-e-2 model so the images are pretty bad,
this is just for demo purposes, as I'm returning a base64 and saving it to localstorage.
 In real-world app of course we could use a much better model (dall-e-3)
to generate amazing images, then optimize and save them with something like cloudinary.
- I created initial cypress testing, demonstrating access to vue component, 
of course much more can be done but this is sufficient for demo I hope.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

I really appreciate the time and opportunity, thank you!

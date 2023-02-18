
import { useState } from "react";
import { useForm } from "react-hook-form";

import supportedlan from "../supportedLanguages.json";
import translationIcon from "../icons/translation.gif"

import { Heading, SimpleGrid, Textarea, Box, Container, Button, Text, Card, CardHeader, CardBody, Center } from '@chakra-ui/react';

console.log(supportedlan);


function Translate() {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [translatedText, setTranslatedText] = useState("");

  const [detectedLang, setDetectedLang] = useState("");

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);


  const onSubmit = data => {

    setIsLoadingBtn(true);

    console.log(data);

    const encodedParams = new URLSearchParams();
    encodedParams.append("q", data.textRequired);
    encodedParams.append("format", "text");
    encodedParams.append("target", "en");

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': 'ba4297ccadmsh81359987f2544c5p104fa9jsn6bf3224d7a19',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      body: encodedParams
    };

    fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', options)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);

        const resultObj = supportedlan.text.find(obj => obj.code === responseData.data.translations[0].detectedSourceLanguage);
        const supportedLanuage = resultObj.language;

        setTimeout(() => {
          setTranslatedText(responseData.data.translations[0].translatedText);
          setDetectedLang(supportedLanuage ? supportedLanuage : "Unable to find language name");
          setIsLoadingBtn(false);
        }, 5000);
      })
      .catch(err => console.error(err));
  };

  console.log(watch("textRequired"));


  return (
    <Container size="md" p="10px" maxW="100vw" as="section">
      <Heading as="h2" mb="8" textAlign="center">LingoLens</Heading>

      <SimpleGrid columns={[1, 2]} spacingX="40px">
        <Box m="2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box px="2" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Textarea maxW="400px" placeholder="Enter text here to translate" {...register("textRequired", { required: true })} />
              <Text color="red" visibility={errors.textRequired ? "visible" : "hidden"}>You must provide some text to translate!</Text>
              <Button
                colorScheme="whiteAlpha"
                maxW="350px"
                isLoading={isLoadingBtn}
                loadingText="Retrieving data"
                spinnerPlacement="end"
                my="5"
                type="submit"
                value="Translate"
                spinner={<img style={{ maxHeight: "3ch" }} src={translationIcon} alt="loading" />}
              >Translate</Button>
            </Box>
          </form>
        </Box>
        <Card mx="auto" w="100%" h="100%" maxW="500px" bg="whiteAlpha.700" display="flex" flexDirection="column" justifyContent="start" alignItems="center">
          {translatedText ? (
            <>
              <CardHeader><Heading size="md">Detected language: {detectedLang}</Heading></CardHeader>
              <CardBody><Text>{translatedText}</Text></CardBody>
            </>
          ) : <CardBody><Text>Enter some text to translate.</Text></CardBody>}
        </Card>
      </SimpleGrid>
    </Container>
  );
}

export default Translate;

# bidrag-ui-static-files

App som har ansvar for å serve statiske ressurser for frontender.
Brukes spesielt til å unngå at klienter henter statiske filer fra podder med ulik versjon når appen deployes.
Tanken er at hvert team med behov for en slik app kan ha sin egen instans av denne applikasjonen.

Denne appen server alle filene som ligger i en bucket. 
Filene blir cachet i podden i en time før de hentes på nytt fra bucketen. Dette for å hindre minnelekasje over tid.

## Opplasting til bucket
Man må laste opp filene til bucketen før man deployer en ny versjon av frontend. Dette er praktisk å gjøre i en Github action.
For å få tilgang til å laste opp må man opprette en `service account` med rollen `Storage Legacy Bucket Owner` på denne appens sin bucket.
Man oppretter så en key for denne service accounten man legger til som en reposiory secret i repoet hvor ressursene skal lastes opp fra.

Se GHA workflow i spinnsyn-frontend [spinnsyn-frontend](https://github.com/navikt/spinnsyn-frontend) for et eksempel.

Din google konto må ha rollene `Service Account Admin`, `Service Account Key Admin` og `Storage Admin` midlertidig for å lage denne service accounten.
Husk å fjerne rollene når du ikke lengre trenger dem.


## Bruk fra app2
I en next app hvor filene er lastet opp til denne appen kan man sette `assetPrefix` til å peke på denne appen. 

Se i appen spinnsyn-frontend [spinnsyn-frontend](https://github.com/navikt/spinnsyn-frontend) for et eksempel.

# Henvendelser


Spørsmål knyttet til koden eller prosjektet kan stilles til bidrag@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-bidrag.

# Node.js Cron Scheduler
# [PL]

## Opis
CronScheduler to elastyczny mechanizm harmonogramowania zadań w Node.js. Pozwala na uruchamianie zadań w określonych odstępach czasowych lub o konkretnej godzinie. Został zaprojektowany z myślą o prostocie i elastyczności, z możliwością użycia w środowiskach rozproszonych.

## Funkcje
- Uruchamianie zadań co określony interwał czasowy lub o konkretnych godzinach.
- Mechanizm blokad oparty na systemie plików do synchronizacji w środowiskach rozproszonych.
- Łatwa integracja z istniejącymi aplikacjami Node.js.
- Obsługa zadań asynchronicznych i synchronicznych.

## Instalacja
Brak zewnętrznych zależności. Wystarczy skopiować klasę `CronScheduler` do projektu.

## Szybki Start
1. Utwórz instancję `CronScheduler` z ścieżką do katalogu i interwałem odświeżania.
```javascript
const cronScheduler = new CronScheduler('ścieżka/do/katalogu', interwałOdświeżaąnia);
```

# [EN]

## Description
CronScheduler is a flexible task scheduling mechanism in Node.js. It allows for executing tasks at specified time intervals or at specific times. Designed for simplicity and flexibility, it can be used in distributed environments.

## Features
- Schedule tasks to run at fixed intervals or at specific times.
- File-system-based locking mechanism for synchronization in distributed environments.
- Easy integration with existing Node.js applications.
- Supports both asynchronous and synchronous tasks.

## Installation
No external dependencies required. Simply copy the `CronScheduler` class into your project.

## Quick Start
1. Create an instance of `CronScheduler` with a directory path and a refresh interval.ą
```javascript
const cronScheduler = new CronScheduler('path/to/directory', refreshInterval);
```

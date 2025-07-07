// ==UserScript==
// @name         cw navigator
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  ---
// @author       emoji
// @match        https://catwar.net/cw3/
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

    // ======================================================================================
    // 1. БАЗА ДАННЫХ ЛОКАЦИЙ (MAP_DATA)
    //    'x', 'y' в 'exits' - это 0-индексированные координаты (0-9 для x, 0-5 для y)
    //    'targetMap' - уникальное имя целевой локации.
    //    'exitLabel' - текст, который отображается на клетке перехода в игре.
    //    'direction' - направление, если оно имеет смысл (для для справки).
    // ======================================================================================
    const MAP_DATA = {
        "camp": {
            "mapName": "Лагерь Морского племени",
            "uniqueName": "camp",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "blackberry_thickets", "exitLabel": "Ежевичные заросли" },
                { "x": 0, "y": 1, "targetMap": "whispering_meadow", "exitLabel": "Шепчущая лужайка" },
                { "x": 8, "y": 1, "targetMap": "outhouse", "exitLabel": "Отхожее место" },
                { "x": 9, "y": 2, "targetMap": "east_coast", "exitLabel": "Побережье" },
                { "x": 9, "y": 3, "targetMap": "bear_rock", "exitLabel": "Медвежья скала" },
                { "x": 0, "y": 4, "targetMap": "stone_cave", "exitLabel": "Пещерка в камнях" },
                { "x": 3, "y": 4, "targetMap": "tournament_ground", "exitLabel": "Ристалище" },
                { "x": 0, "y": 5, "targetMap": "flower_garden", "exitLabel": "Цветник" },
                { "x": 4, "y": 5, "targetMap": "south_coast", "exitLabel": "Побережье" }
            ]
        },
        "east_coast": {
            "mapName": "Восточное побережье",
            "uniqueName": "east_coast",
            "exits": [
                { "x": 1, "y": 4, "targetMap": "camp", "exitLabel": "Лагерь Морского племени" },
                { "x": 4, "y": 0, "targetMap": "abandoned_lighthouse", "exitLabel": "Заброшенный маяк" },
                { "x": 3, "y": 5, "targetMap": "shallows_1", "exitLabel": "Мелководье" },
                { "x": 8, "y": 5, "targetMap": "shallows_2", "exitLabel": "Мелководье" }
            ]
        },
        "south_coast": {
            "mapName": "Южное побережье",
            "uniqueName": "south_coast",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "camp", "exitLabel": "Лагерь Морского племени" },
                { "x": 0, "y": 1, "targetMap": "frog_pond", "exitLabel": "Лягушатник" }
            ]
        },
        "frog_pond": {
            "mapName": "Лягушатник",
            "uniqueName": "frog_pond",
            "exits": [
                { "x": 8, "y": 2, "targetMap": "south_coast", "exitLabel": "Побережье" }
            ]
        },
        "abandoned_lighthouse": {
            "mapName": "Заброшенный маяк",
            "uniqueName": "abandoned_lighthouse",
            "exits": [
                { "x": 6, "y": 5, "targetMap": "east_coast", "exitLabel": "Побережье" },
                { "x": 9, "y": 2, "targetMap": "shallows_3", "exitLabel": "Мелководье" },
                { "x": 4, "y": 0, "targetMap": "stormy_bay", "exitLabel": "Штормовая бухта" },
                { "x": 0, "y": 3, "targetMap": "orange_grove", "exitLabel": "Апельсиновая роща" }
            ]
        },
        "orange_grove": {
            "mapName": "Апельсиновая роща",
            "uniqueName": "orange_grove",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "coast_north", "exitLabel": "Побережье" },
                { "x": 9, "y": 0, "targetMap": "stormy_bay", "exitLabel": "Штормовая бухта" },
                { "x": 9, "y": 3, "targetMap": "abandoned_lighthouse", "exitLabel": "Заброшенный маяк" },
                { "x": 0, "y": 5, "targetMap": "sunken_ship", "exitLabel": "Погибший корабль" }
            ]
        },
        "stormy_bay": {
            "mapName": "Штормовая бухта",
            "uniqueName": "stormy_bay",
            "exits": [
                { "x": 2, "y": 0, "targetMap": "shallows_5", "exitLabel": "Мелководье" },
                { "x": 0, "y": 2, "targetMap": "coast_north", "exitLabel": "Побережье" },
                { "x": 1, "y": 5, "targetMap": "orange_grove", "exitLabel": "Апельсиновая роща" },
                { "x": 8, "y": 5, "targetMap": "abandoned_lighthouse", "exitLabel": "Заброшенный маяк" }
            ]
        },
        "coast_north": {
            "mapName": "Побережье (северное)",
            "uniqueName": "coast_north",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "sandbank", "exitLabel": "Отмель" },
                { "x": 0, "y": 3, "targetMap": "shallows_4", "exitLabel": "Мелководье" },
                { "x": 9, "y": 4, "targetMap": "stormy_bay", "exitLabel": "Штормовая бухта" },
                { "x": 6, "y": 5, "targetMap": "orange_grove", "exitLabel": "Апельсиновая роща" }
            ]
        },
        "shallows_4": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_4",
            "exits": [
                { "x": 9, "y": 0, "targetMap": "coast_north", "exitLabel": "Побережье" },
                { "x": 2, "y": 5, "targetMap": "lagoon", "exitLabel": "Лагуна" }
            ]
        },
        "lagoon": {
            "mapName": "Лагуна",
            "uniqueName": "lagoon",
            "exits": [
                { "x": 3, "y": 0, "targetMap": "shallows_4", "exitLabel": "Мелководье" },
                { "x": 0, "y": 1, "targetMap": "salt_trail", "exitLabel": "Солёная тропа" },
                { "x": 3, "y": 5, "targetMap": "sunken_ship", "exitLabel": "Погибший корабль" }
            ]
        },
        "sunken_ship": {
            "mapName": "Погибший корабль",
            "uniqueName": "sunken_ship",
            "exits": [
                { "x": 7, "y": 1, "targetMap": "orange_grove", "exitLabel": "Апельсиновая роща" },
                { "x": 0, "y": 4, "targetMap": "sea_1", "exitLabel": "Море" }
            ]
        },
        "sea_1": {
            "mapName": "Море",
            "uniqueName": "sea_1",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "sea_5", "exitLabel": "море" },
                { "x": 9, "y": 3, "targetMap": "sunken_ship", "exitLabel": "погибший корабль" },
                { "x": 2, "y": 5, "targetMap": "sea_2", "exitLabel": "море" },
                { "x": 7, "y": 5, "targetMap": "sea_3", "exitLabel": "море" }
            ]
        },
        "sea_2": {
            "mapName": "Море",
            "uniqueName": "sea_2",
            "exits": [
                { "x": 6, "y": 2, "targetMap": "sea_1", "exitLabel": "море" },
                { "x": 9, "y": 2, "targetMap": "sea_3", "exitLabel": "море" },
                { "x": 1, "y": 5, "targetMap": "sandy_island", "exitLabel": "песчаный остров" }
            ]
        },
        "sea_3": {
            "mapName": "Море",
            "uniqueName": "sea_3",
            "exits": [
                { "x": 1, "y": 2, "targetMap": "sea_2", "exitLabel": "море" },
                { "x": 9, "y": 2, "targetMap": "sea_4", "exitLabel": "море" }
            ]
        },
        "sea_4": {
            "mapName": "Море",
            "uniqueName": "sea_4",
            "exits": [
                { "x": 3, "y": 0, "targetMap": "salt_trail", "exitLabel": "солёная тропа" },
                { "x": 5, "y": 0, "targetMap": "frog_pond", "exitLabel": "лягушатник" },
                { "x": 1, "y": 2, "targetMap": "sea_3", "exitLabel": "море" },
                { "x": 2, "y": 5, "targetMap": "shallows_6", "exitLabel": "мелководье" }
            ]
        },
        "blackberry_thickets": {
            "mapName": "Ежевичные заросли",
            "uniqueName": "blackberry_thickets",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "bush_sizzling_berries", "exitLabel": "куст сизых ягод" },
                { "x": 2, "y": 0, "targetMap": "bush_blue_berries", "exitLabel": "куст синих ягод" },
                { "x": 3, "y": 0, "targetMap": "bush_black_berries", "exitLabel": "куст чёрных ягод" },
                { "x": 4, "y": 0, "targetMap": "camp", "exitLabel": "лагерь морского племени" },
                { "x": 0, "y": 2, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" },
                { "x": 7, "y": 2, "targetMap": "clear_glade", "exitLabel": "ясная полянка" },
                { "x": 9, "y": 2, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" },
                { "x": 0, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" },
                { "x": 4, "y": 5, "targetMap": "berry_hole", "exitLabel": "ягодный лаз" },
                { "x": 9, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" }
            ]
        },
        "whispering_meadow": {
            "mapName": "Шепчущая лужайка",
            "uniqueName": "whispering_meadow",
            "exits": [
                { "x": 4, "y": 5, "targetMap": "camp", "exitLabel": "лагерь морского племени" }
            ]
        },
        "outhouse": {
            "mapName": "Отхожее место",
            "uniqueName": "outhouse",
            "exits": [
                { "x": 0, "y": 2, "targetMap": "camp", "exitLabel": "лагерь морского племени" },
                { "x": 9, "y": 5, "targetMap": "pile_of_game", "exitLabel": "куча с дичью" }
            ]
        },
        "pile_of_game": {
            "mapName": "Куча с дичью",
            "uniqueName": "pile_of_game",
            "exits": [
                { "x": 0, "y": 2, "targetMap": "bear_rock", "exitLabel": "медвежья скала" },
                { "x": 9, "y": 3, "targetMap": "outhouse", "exitLabel": "отхожее место" },
                { "x": 0, "y": 5, "targetMap": "camp", "exitLabel": "лагерь морского племени" }
            ]
        },
        "bear_rock": {
            "mapName": "Медвежья скала",
            "uniqueName": "bear_rock",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "camp", "exitLabel": "лагерь морского племени" },
                { "x": 7, "y": 2, "targetMap": "spot_behind_rock_2", "exitLabel": "местечко за скалой №2" },
                { "x": 5, "y": 4, "targetMap": "bear_maw", "exitLabel": "медвежья пасть" },
                { "x": 8, "y": 4, "targetMap": "pile_of_game", "exitLabel": "куча с дичью" },
                { "x": 0, "y": 5, "targetMap": "spot_behind_rock_1", "exitLabel": "местечко за скалой №1" }
            ]
        },
        "bear_maw": {
            "mapName": "Медвежья пасть",
            "uniqueName": "bear_maw",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "bear_rock", "exitLabel": "медвежья скала" },
                { "x": 0, "y": 2, "targetMap": "small_circle_cave_1", "exitLabel": "пещера малого круга №1" },
                { "x": 9, "y": 2, "targetMap": "small_circle_cave_2", "exitLabel": "пещера малого круга №2" },
                { "x": 4, "y": 5, "targetMap": "secret_passage", "exitLabel": "тайный ход" }
            ]
        },
        "secret_passage": {
            "mapName": "Тайный ход",
            "uniqueName": "secret_passage",
            "exits": [
                { "x": 8, "y": 0, "targetMap": "bear_maw", "exitLabel": "медвежья пасть" },
                { "x": 5, "y": 3, "targetMap": "glade_behind_stones", "exitLabel": "полянка за камнями" },
                { "x": 2, "y": 5, "targetMap": "collectors_hq", "exitLabel": "штаб собирателей" },
                { "x": 4, "y": 5, "targetMap": "explorers_hq", "exitLabel": "штаб исследователей" },
                { "x": 6, "y": 5, "targetMap": "fighters_hq", "exitLabel": "штаб бойцов" },
                { "x": 8, "y": 5, "targetMap": "guards_hq", "exitLabel": "штаб стражей" }
            ]
        },
        "tournament_ground": {
            "mapName": "Ристалище",
            "uniqueName": "tournament_ground",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "camp", "exitLabel": "лагерь морского племени" },
                { "x": 0, "y": 2, "targetMap": "tournament_ground_1", "exitLabel": "ристалище №1" },
                { "x": 9, "y": 2, "targetMap": "tournament_ground_5", "exitLabel": "ристалище №5" },
                { "x": 0, "y": 5, "targetMap": "tournament_ground_2", "exitLabel": "ристалище №2" },
                { "x": 4, "y": 5, "targetMap": "tournament_ground_3", "exitLabel": "ристалище №3" },
                { "x": 9, "y": 5, "targetMap": "tournament_ground_4", "exitLabel": "ристалище №4" }
            ]
        },
        "stone_cave": {
            "mapName": "Пещерка в камнях",
            "uniqueName": "stone_cave",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "camp", "exitLabel": "лагерь морского племени" },
                { "x": 0, "y": 5, "targetMap": "stone_cave_1", "exitLabel": "пещерка в камнях №1" },
                { "x": 9, "y": 5, "targetMap": "stone_cave_2", "exitLabel": "пещерка в камнях №2" }
            ]
        },
        "clear_glade": {
            "mapName": "Ясная полянка",
            "uniqueName": "clear_glade",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "camp", "exitLabel": "лагерь морского племени" },
                { "x": 9, "y": 1, "targetMap": "game_glade", "exitLabel": "полянка для игр" },
                { "x": 0, "y": 2, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" },
                { "x": 0, "y": 4, "targetMap": "nest_black_feathers", "exitLabel": "гнездо чёрных перьев" },
                { "x": 9, "y": 4, "targetMap": "nest_white_feathers", "exitLabel": "гнездо белых перьев" },
                { "x": 1, "y": 5, "targetMap": "nest_yellow_feathers", "exitLabel": "гнездо жёлтых перьев" },
                { "x": 4, "y": 5, "targetMap": "nest_motley_feathers", "exitLabel": "гнездо пёстрых перьев" },
                { "x": 7, "y": 5, "targetMap": "nest_brown_feathers", "exitLabel": "гнездо бурых перьев" }
            ]
        },
        "game_glade": {
            "mapName": "Полянка для игр",
            "uniqueName": "game_glade",
            "exits": [
                { "x": 8, "y": 1, "targetMap": "clear_glade", "exitLabel": "ясная полянка" },
                { "x": 0, "y": 2, "targetMap": "sunny_glade", "exitLabel": "солнечная полянка" }
            ]
        },
        "sunny_glade": {
            "mapName": "Солнечная полянка",
            "uniqueName": "sunny_glade",
            "exits": [
                { "x": 9, "y": 1, "targetMap": "game_glade", "exitLabel": "полянка для игр" }
            ]
        },
        "nest_white_feathers": {
            "mapName": "Гнездо белых перьев",
            "uniqueName": "nest_white_feathers",
            "exits": [
                { "x": 3, "y": 0, "targetMap": "nest_white_feathers_1", "exitLabel": "гнёздышко №1" },
                { "x": 5, "y": 0, "targetMap": "nest_white_feathers_2", "exitLabel": "гнёздышко №2" },
                { "x": 7, "y": 0, "targetMap": "nest_white_feathers_3", "exitLabel": "гнёздышко №3" },
                { "x": 9, "y": 0, "targetMap": "nest_white_feathers_4", "exitLabel": "гнёздышко №4" },
                { "x": 9, "y": 2, "targetMap": "nest_white_feathers_5", "exitLabel": "гнёздышко №5" },
                { "x": 0, "y": 4, "targetMap": "clear_glade", "exitLabel": "ясная полянка" }
            ]
        },
        "nest_brown_feathers": {
            "mapName": "Гнездо бурых перьев",
            "uniqueName": "nest_brown_feathers",
            "exits": [
                { "x": 7, "y": 0, "targetMap": "clear_glade", "exitLabel": "ясная полянка" },
                { "x": 1, "y": 5, "targetMap": "nest_brown_feathers_1", "exitLabel": "гнёздышко №1" },
                { "x": 3, "y": 5, "targetMap": "nest_brown_feathers_2", "exitLabel": "гнёздышко №2" },
                { "x": 5, "y": 5, "targetMap": "nest_brown_feathers_3", "exitLabel": "гнёздышко №3" },
                { "x": 7, "y": 5, "targetMap": "nest_brown_feathers_4", "exitLabel": "гнёздышко №4" },
                { "x": 9, "y": 5, "targetMap": "nest_brown_feathers_5", "exitLabel": "гнёздышко №5" }
            ]
        },
        "nest_motley_feathers": {
            "mapName": "Гнездо пёстрых перьев",
            "uniqueName": "nest_motley_feathers",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "clear_glade", "exitLabel": "ясная полянка" },
                { "x": 2, "y": 4, "targetMap": "nest_motley_feathers_2", "exitLabel": "гнёздышко №2" },
                { "x": 4, "y": 4, "targetMap": "nest_motley_feathers_3", "exitLabel": "гнёздышко №3" },
                { "x": 6, "y": 4, "targetMap": "nest_motley_feathers_4", "exitLabel": "гнёздышко №4" },
                { "x": 0, "y": 5, "targetMap": "nest_motley_feathers_1", "exitLabel": "гнёздышко №1" },
                { "x": 9, "y": 5, "targetMap": "nest_motley_feathers_5", "exitLabel": "гнёздышко №5" }
            ]
        },
        "nest_yellow_feathers": {
            "mapName": "Гнездо желтых перьев",
            "uniqueName": "nest_yellow_feathers",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "clear_glade", "exitLabel": "ясная полянка" },
                { "x": 0, "y": 5, "targetMap": "nest_yellow_feathers_1", "exitLabel": "гнёздышко №1" },
                { "x": 2, "y": 5, "targetMap": "nest_yellow_feathers_2", "exitLabel": "гнёздышко №2" },
                { "x": 4, "y": 5, "targetMap": "nest_yellow_feathers_3", "exitLabel": "гнёздышко №3" },
                { "x": 6, "y": 5, "targetMap": "nest_yellow_feathers_4", "exitLabel": "гнёздышко №4" },
                { "x": 8, "y": 5, "targetMap": "nest_yellow_feathers_5", "exitLabel": "гнёздышко №5" }
            ]
        },
        "nest_black_feathers": {
            "mapName": "Гнездо чёрных перьев",
            "uniqueName": "nest_black_feathers",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "nest_black_feathers_2", "exitLabel": "гнёздышко №2" },
                { "x": 2, "y": 0, "targetMap": "nest_black_feathers_3", "exitLabel": "гнёздышко №3" },
                { "x": 4, "y": 0, "targetMap": "nest_black_feathers_4", "exitLabel": "гнёздышко №4" },
                { "x": 6, "y": 0, "targetMap": "nest_black_feathers_5", "exitLabel": "гнёздышко №5" },
                { "x": 0, "y": 2, "targetMap": "nest_black_feathers_1", "exitLabel": "гнёздышко №1" },
                { "x": 9, "y": 4, "targetMap": "clear_glade", "exitLabel": "ясная полянка" }
            ]
        },
        "berry_hole": {
            "mapName": "Ягодный лаз",
            "uniqueName": "berry_hole",
            "exits": [
                { "x": 4, "y": 1, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" },
                { "x": 1, "y": 5, "targetMap": "hiding_clicking_claws", "exitLabel": "укрытие щелкающих клешней" },
                { "x": 4, "y": 5, "targetMap": "hiding_nimble_fins", "exitLabel": "укрытие резвых плавников" },
                { "x": 8, "y": 5, "targetMap": "hiding_sharp_teeth", "exitLabel": "укрытие острых зубов" }
            ]
        },

        // Кусты ягод
        "bush_black_berries": {
            "mapName": "Куст чёрных ягод",
            "uniqueName": "bush_black_berries",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "bush_black_berries_1", "exitLabel": "кустик №1" },
                { "x": 2, "y": 0, "targetMap": "bush_black_berries_2", "exitLabel": "кустик №2" },
                { "x": 4, "y": 0, "targetMap": "bush_black_berries_3", "exitLabel": "кустик №3" },
                { "x": 6, "y": 0, "targetMap": "bush_black_berries_4", "exitLabel": "кустик №4" },
                { "x": 8, "y": 0, "targetMap": "bush_black_berries_5", "exitLabel": "кустик №5" },
                { "x": 4, "y": 5, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" }
            ]
        },
        "bush_blue_berries": {
            "mapName": "Куст синих ягод",
            "uniqueName": "bush_blue_berries",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "bush_blue_berries_1", "exitLabel": "кустик №1" },
                { "x": 2, "y": 0, "targetMap": "bush_blue_berries_2", "exitLabel": "кустик №2" },
                { "x": 4, "y": 0, "targetMap": "bush_blue_berries_3", "exitLabel": "кустик №3" },
                { "x": 6, "y": 0, "targetMap": "bush_blue_berries_4", "exitLabel": "кустик №4" },
                { "x": 8, "y": 0, "targetMap": "bush_blue_berries_5", "exitLabel": "кустик №5" },
                { "x": 3, "y": 5, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" }
            ]
        },
        "bush_sizzling_berries": {
            "mapName": "Куст сизых ягод",
            "uniqueName": "bush_sizzling_berries",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "bush_sizzling_berries_1", "exitLabel": "кустик №1" },
                { "x": 2, "y": 0, "targetMap": "bush_sizzling_berries_2", "exitLabel": "кустик №2" },
                { "x": 4, "y": 0, "targetMap": "bush_sizzling_berries_3", "exitLabel": "кустик №3" },
                { "x": 6, "y": 0, "targetMap": "bush_sizzling_berries_4", "exitLabel": "кустик №4" },
                { "x": 8, "y": 0, "targetMap": "bush_sizzling_berries_5", "exitLabel": "кустик №5" },
                { "x": 5, "y": 5, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" }
            ]
        },
        "bush_lilac_berries": {
            "mapName": "Куст лиловых ягод",
            "uniqueName": "bush_lilac_berries",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "bush_lilac_berries_1", "exitLabel": "кустик №1" },
                { "x": 0, "y": 1, "targetMap": "bush_lilac_berries_2", "exitLabel": "кустик №2" },
                { "x": 0, "y": 2, "targetMap": "bush_lilac_berries_3", "exitLabel": "кустик №3" },
                { "x": 9, "y": 2, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" },
                { "x": 0, "y": 3, "targetMap": "bush_lilac_berries_4", "exitLabel": "кустик №4" },
                { "x": 0, "y": 4, "targetMap": "bush_lilac_berries_5", "exitLabel": "кустик №5" },
                { "x": 0, "y": 5, "targetMap": "bush_lilac_berries_6", "exitLabel": "кустик №6" }
            ]
        },
        "bush_scarlet_berries": {
            "mapName": "Куст алых ягод",
            "uniqueName": "bush_scarlet_berries",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "bush_scarlet_berries_1", "exitLabel": "кустик №1" },
                { "x": 0, "y": 1, "targetMap": "bush_scarlet_berries_2", "exitLabel": "кустик №2" },
                { "x": 0, "y": 2, "targetMap": "bush_scarlet_berries_3", "exitLabel": "кустик №3" },
                { "x": 0, "y": 3, "targetMap": "bush_scarlet_berries_4", "exitLabel": "кустик №4" },
                { "x": 0, "y": 4, "targetMap": "bush_scarlet_berries_5", "exitLabel": "кустик №5" },
                { "x": 9, "y": 4, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" },
                { "x": 0, "y": 5, "targetMap": "bush_scarlet_berries_6", "exitLabel": "кустик №6" }
            ]
        },
        "bush_burgundy_berries": {
            "mapName": "Куст бордовых ягод",
            "uniqueName": "bush_burgundy_berries",
            "exits": [
                { "x": 9, "y": 0, "targetMap": "bush_burgundy_berries_1", "exitLabel": "кустик №1" },
                { "x": 9, "y": 1, "targetMap": "bush_burgundy_berries_2", "exitLabel": "кустик №2" },
                { "x": 9, "y": 2, "targetMap": "bush_burgundy_berries_3", "exitLabel": "кустик №3" },
                { "x": 9, "y": 3, "targetMap": "bush_burgundy_berries_4", "exitLabel": "кустик №4" },
                { "x": 0, "y": 4, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" },
                { "x": 9, "y": 4, "targetMap": "bush_burgundy_berries_5", "exitLabel": "кустик №5" },
                { "x": 9, "y": 5, "targetMap": "bush_burgundy_berries_6", "exitLabel": "кустик №6" }
            ]
        },
        "bush_purple_berries": {
            "mapName": "Куст пурпурных ягод",
            "uniqueName": "bush_purple_berries",
            "exits": [
                { "x": 9, "y": 0, "targetMap": "bush_purple_berries_1", "exitLabel": "кустик №1" },
                { "x": 9, "y": 1, "targetMap": "bush_purple_berries_2", "exitLabel": "кустик №2" },
                { "x": 0, "y": 2, "targetMap": "blackberry_thickets", "exitLabel": "ежевичные заросли" },
                { "x": 9, "y": 2, "targetMap": "bush_purple_berries_3", "exitLabel": "кустик №3" },
                { "x": 9, "y": 3, "targetMap": "bush_purple_berries_4", "exitLabel": "кустик №4" },
                { "x": 9, "y": 4, "targetMap": "bush_purple_berries_5", "exitLabel": "кустик №5" },
                { "x": 9, "y": 5, "targetMap": "bush_purple_berries_6", "exitLabel": "кустик №6" }
            ]
        },

        // Номерные гнёздышки (подлокации)
        "nest_white_feathers_1": { "mapName": "гнёздышко №1", "uniqueName": "nest_white_feathers_1", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_white_feathers", "exitLabel": "гнездо белых перьев" } ] },
        "nest_white_feathers_2": { "mapName": "гнёздышко №2", "uniqueName": "nest_white_feathers_2", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_white_feathers", "exitLabel": "гнездо белых перьев" } ] },
        "nest_white_feathers_3": { "mapName": "гнёздышко №3", "uniqueName": "nest_white_feathers_3", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_white_feathers", "exitLabel": "гнездо белых перьев" } ] },
        "nest_white_feathers_4": { "mapName": "гнёздышко №4", "uniqueName": "nest_white_feathers_4", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_white_feathers", "exitLabel": "гнездо белых перьев" } ] },
        "nest_white_feathers_5": { "mapName": "гнёздышко №5", "uniqueName": "nest_white_feathers_5", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_white_feathers", "exitLabel": "гнездо белых перьев" } ] },

        "nest_brown_feathers_1": { "mapName": "гнёздышко №1", "uniqueName": "nest_brown_feathers_1", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_brown_feathers", "exitLabel": "гнездо бурых перьев" } ] },
        "nest_brown_feathers_2": { "mapName": "гнёздышко №2", "uniqueName": "nest_brown_feathers_2", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_brown_feathers", "exitLabel": "гнездо бурых перьев" } ] },
        "nest_brown_feathers_3": { "mapName": "гнёздышко №3", "uniqueName": "nest_brown_feathers_3", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_brown_feathers", "exitLabel": "гнездо бурых перьев" } ] },
        "nest_brown_feathers_4": { "mapName": "гнёздышко №4", "uniqueName": "nest_brown_feathers_4", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_brown_feathers", "exitLabel": "гнездо бурых перьев" } ] },
        "nest_brown_feathers_5": { "mapName": "гнёздышко №5", "uniqueName": "nest_brown_feathers_5", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_brown_feathers", "exitLabel": "гнездо бурых перьев" } ] },

        "nest_motley_feathers_1": { "mapName": "гнёздышко №1", "uniqueName": "nest_motley_feathers_1", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_motley_feathers", "exitLabel": "гнездо пёстрых перьев" } ] },
        "nest_motley_feathers_2": { "mapName": "гнёздышко №2", "uniqueName": "nest_motley_feathers_2", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_motley_feathers", "exitLabel": "гнездо пёстрых перьев" } ] },
        "nest_motley_feathers_3": { "mapName": "гнёздышко №3", "uniqueName": "nest_motley_feathers_3", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_motley_feathers", "exitLabel": "гнездо пёстрых перьев" } ] },
        "nest_motley_feathers_4": { "mapName": "гнёздышко №4", "uniqueName": "nest_motley_feathers_4", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_motley_feathers", "exitLabel": "гнездо пёстрых перьев" } ] },
        "nest_motley_feathers_5": { "mapName": "гнёздышко №5", "uniqueName": "nest_motley_feathers_5", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_motley_feathers", "exitLabel": "гнездо пёстрых перьев" } ] },

        "nest_yellow_feathers_1": { "mapName": "гнёздышко №1", "uniqueName": "nest_yellow_feathers_1", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_yellow_feathers", "exitLabel": "гнездо жёлтых перьев" } ] },
        "nest_yellow_feathers_2": { "mapName": "гнёздышко №2", "uniqueName": "nest_yellow_feathers_2", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_yellow_feathers", "exitLabel": "гнездо жёлтых перьев" } ] },
        "nest_yellow_feathers_3": { "mapName": "гнёздышко №3", "uniqueName": "nest_yellow_feathers_3", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_yellow_feathers", "exitLabel": "гнездо жёлтых перьев" } ] },
        "nest_yellow_feathers_4": { "mapName": "гнёздышко №4", "uniqueName": "nest_yellow_feathers_4", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_yellow_feathers", "exitLabel": "гнездо жёлтых перьев" } ] },
        "nest_yellow_feathers_5": { "mapName": "гнёздышко №5", "uniqueName": "nest_yellow_feathers_5", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_yellow_feathers", "exitLabel": "гнездо жёлтых перьев" } ] },

        "nest_black_feathers_1": { "mapName": "гнёздышко №1", "uniqueName": "nest_black_feathers_1", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_black_feathers", "exitLabel": "гнездо чёрных перьев" } ] },
        "nest_black_feathers_2": { "mapName": "гнёздышко №2", "uniqueName": "nest_black_feathers_2", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_black_feathers", "exitLabel": "гнездо чёрных перьев" } ] },
        "nest_black_feathers_3": { "mapName": "гнёздышко №3", "uniqueName": "nest_black_feathers_3", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_black_feathers", "exitLabel": "гнездо чёрных перьев" } ] },
        "nest_black_feathers_4": { "mapName": "гнёздышко №4", "uniqueName": "nest_black_feathers_4", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_black_feathers", "exitLabel": "гнездо чёрных перьев" } ] },
        "nest_black_feathers_5": { "mapName": "гнёздышко №5", "uniqueName": "nest_black_feathers_5", "exits": [ { "x": 4, "y": 5, "targetMap": "nest_black_feathers", "exitLabel": "гнездо чёрных перьев" } ] },

        // Номерные кустики (подлокации)
        "bush_black_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_black_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_black_berries", "exitLabel": "куст чёрных ягод" } ] },
        "bush_black_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_black_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_black_berries", "exitLabel": "куст чёрных ягод" } ] },
        "bush_black_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_black_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_black_berries", "exitLabel": "куст чёрных ягод" } ] },
        "bush_black_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_black_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_black_berries", "exitLabel": "куст чёрных ягод" } ] },
        "bush_black_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_black_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_black_berries", "exitLabel": "куст чёрных ягод" } ] },

        "bush_blue_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_blue_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_blue_berries", "exitLabel": "куст синих ягод" } ] },
        "bush_blue_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_blue_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_blue_berries", "exitLabel": "куст синих ягод" } ] },
        "bush_blue_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_blue_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_blue_berries", "exitLabel": "куст синих ягод" } ] },
        "bush_blue_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_blue_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_blue_berries", "exitLabel": "куст синих ягод" } ] },
        "bush_blue_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_blue_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_blue_berries", "exitLabel": "куст синих ягод" } ] },

        "bush_sizzling_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_sizzling_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_sizzling_berries", "exitLabel": "куст сизых ягод" } ] },
        "bush_sizzling_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_sizzling_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_sizzling_berries", "exitLabel": "куст сизых ягод" } ] },
        "bush_sizzling_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_sizzling_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_sizzling_berries", "exitLabel": "куст сизых ягод" } ] },
        "bush_sizzling_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_sizzling_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_sizzling_berries", "exitLabel": "куст сизых ягод" } ] },
        "bush_sizzling_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_sizzling_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_sizzling_berries", "exitLabel": "куст сизых ягод" } ] },

        "bush_lilac_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_lilac_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" } ] },
        "bush_lilac_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_lilac_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" } ] },
        "bush_lilac_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_lilac_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" } ] },
        "bush_lilac_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_lilac_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" } ] },
        "bush_lilac_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_lilac_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" } ] },
        "bush_lilac_berries_6": { "mapName": "кустик №6", "uniqueName": "bush_lilac_berries_6", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_lilac_berries", "exitLabel": "куст лиловых ягод" } ] },

        "bush_scarlet_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_scarlet_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" } ] },
        "bush_scarlet_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_scarlet_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" } ] },
        "bush_scarlet_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_scarlet_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" } ] },
        "bush_scarlet_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_scarlet_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" } ] },
        "bush_scarlet_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_scarlet_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" } ] },
        "bush_scarlet_berries_6": { "mapName": "кустик №6", "uniqueName": "bush_scarlet_berries_6", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_scarlet_berries", "exitLabel": "куст алых ягод" } ] },

        "bush_burgundy_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_burgundy_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" } ] },
        "bush_burgundy_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_burgundy_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" } ] },
        "bush_burgundy_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_burgundy_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" } ] },
        "bush_burgundy_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_burgundy_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" } ] },
        "bush_burgundy_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_burgundy_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" } ] },
        "bush_burgundy_berries_6": { "mapName": "кустик №6", "uniqueName": "bush_burgundy_berries_6", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_burgundy_berries", "exitLabel": "куст бордовых ягод" } ] },

        "bush_purple_berries_1": { "mapName": "кустик №1", "uniqueName": "bush_purple_berries_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" } ] },
        "bush_purple_berries_2": { "mapName": "кустик №2", "uniqueName": "bush_purple_berries_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" } ] },
        "bush_purple_berries_3": { "mapName": "кустик №3", "uniqueName": "bush_purple_berries_3", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" } ] },
        "bush_purple_berries_4": { "mapName": "кустик №4", "uniqueName": "bush_purple_berries_4", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" } ] },
        "bush_purple_berries_5": { "mapName": "кустик №5", "uniqueName": "bush_purple_berries_5", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" } ] },
        "bush_purple_berries_6": { "mapName": "кустик №6", "uniqueName": "bush_purple_berries_6", "exits": [ { "x": 4, "y": 5, "targetMap": "bush_purple_berries", "exitLabel": "куст пурпурных ягод" } ] },

        // Укрытия
        "hiding_clicking_claws": { "mapName": "укрытие щелкающих клешней", "uniqueName": "hiding_clicking_claws", "exits": [ { "x": 4, "y": 5, "targetMap": "berry_hole", "exitLabel": "ягодный лаз" } ] },
        "hiding_nimble_fins": { "mapName": "укрытие резвых плавников", "uniqueName": "hiding_nimble_fins", "exits": [ { "x": 4, "y": 5, "targetMap": "berry_hole", "exitLabel": "ягодный лаз" } ] },
        "hiding_sharp_teeth": { "mapName": "укрытие острых зубов", "uniqueName": "hiding_sharp_teeth", "exits": [ { "x": 4, "y": 5, "targetMap": "berry_hole", "exitLabel": "ягодный лаз" } ] },

        // Номерные местечки за скалой
        "spot_behind_rock_1": { "mapName": "местечко за скалой №1", "uniqueName": "spot_behind_rock_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bear_rock", "exitLabel": "медвежья скала" } ] },
        "spot_behind_rock_2": { "mapName": "местечко за скалой №2", "uniqueName": "spot_behind_rock_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bear_rock", "exitLabel": "медвежья скала" } ] },

        // Номерные пещеры малого круга
        "small_circle_cave_1": { "mapName": "пещера малого круга №1", "uniqueName": "small_circle_cave_1", "exits": [ { "x": 4, "y": 5, "targetMap": "bear_maw", "exitLabel": "медвежья пасть" } ] },
        "small_circle_cave_2": { "mapName": "пещера малого круга №2", "uniqueName": "small_circle_cave_2", "exits": [ { "x": 4, "y": 5, "targetMap": "bear_maw", "exitLabel": "медвежья пасть" } ] },

        // Номерные ристалища
        "tournament_ground_1": { "mapName": "ристалище №1", "uniqueName": "tournament_ground_1", "exits": [ { "x": 4, "y": 5, "targetMap": "tournament_ground", "exitLabel": "ристалище" } ] },
        "tournament_ground_2": { "mapName": "ристалище №2", "uniqueName": "tournament_ground_2", "exits": [ { "x": 4, "y": 5, "targetMap": "tournament_ground", "exitLabel": "ристалище" } ] },
        "tournament_ground_3": { "mapName": "ристалище №3", "uniqueName": "tournament_ground_3", "exits": [ { "x": 4, "y": 5, "targetMap": "tournament_ground", "exitLabel": "ристалище" } ] },
        "tournament_ground_4": { "mapName": "ристалище №4", "uniqueName": "tournament_ground_4", "exits": [ { "x": 4, "y": 5, "targetMap": "tournament_ground", "exitLabel": "ристалище" } ] },
        "tournament_ground_5": { "mapName": "ристалище №5", "uniqueName": "tournament_ground_5", "exits": [ { "x": 4, "y": 5, "targetMap": "tournament_ground", "exitLabel": "ристалище" } ] },

        // Номерные пещерки в камнях
        "stone_cave_1": { "mapName": "пещерка в камнях №1", "uniqueName": "stone_cave_1", "exits": [ { "x": 4, "y": 5, "targetMap": "stone_cave", "exitLabel": "пещерка в камнях" } ] },
        "stone_cave_2": { "mapName": "пещерка в камнях №2", "uniqueName": "stone_cave_2", "exits": [ { "x": 4, "y": 5, "targetMap": "stone_cave", "exitLabel": "пещерка в камнях" } ] },

        "shallows_5": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_5",
            "exits": [
                { "x": 9, "y": 1, "targetMap": "sea_9", "exitLabel": "море" },
                { "x": 4, "y": 4, "targetMap": "stormy_bay", "exitLabel": "штормовая бухта" },
                { "x": 9, "y": 4, "targetMap": "sea_10", "exitLabel": "море" }
            ]
        },
        "salt_trail": {
            "mapName": "Солёная тропа",
            "uniqueName": "salt_trail",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "sea_6", "exitLabel": "море" },
                { "x": 9, "y": 2, "targetMap": "lagoon", "exitLabel": "лагуна" },
                { "x": 6, "y": 5, "targetMap": "sea_4", "exitLabel": "море" }
            ]
        },
        "sea_6": {
            "mapName": "Море",
            "uniqueName": "sea_6",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "sea_5", "exitLabel": "море" },
                { "x": 4, "y": 5, "targetMap": "salt_trail", "exitLabel": "солёная тропа" }
            ]
        },
        "sea_5": {
            "mapName": "Море",
            "uniqueName": "sea_5",
            "exits": [
                { "x": 8, "y": 0, "targetMap": "sea_7", "exitLabel": "море" },
                { "x": 9, "y": 1, "targetMap": "sea_8", "exitLabel": "море" },
                { "x": 0, "y": 4, "targetMap": "sea_1", "exitLabel": "море" },
                { "x": 3, "y": 5, "targetMap": "sea_6", "exitLabel": "море" }
            ]
        },
        "sea_7": {
            "mapName": "Море",
            "uniqueName": "sea_7",
            "exits": [
                { "x": 8, "y": 0, "targetMap": "underwater_caves", "exitLabel": "подводные пещеры" },
                { "x": 9, "y": 1, "targetMap": "sea_8", "exitLabel": "море" },
                { "x": 1, "y": 5, "targetMap": "sea_5", "exitLabel": "море" }
            ]
        },
        "underwater_caves": {
            "mapName": "Подводные пещеры",
            "uniqueName": "underwater_caves",
            "exits": [
                { "x": 9, "y": 1, "targetMap": "sea_18", "exitLabel": "море" },
                { "x": 2, "y": 2, "targetMap": "dv_sea_1", "exitLabel": "море" },
                { "x": 1, "y": 5, "targetMap": "sea_7", "exitLabel": "море" }
            ]
        },
        "sea_18": {
            "mapName": "Море",
            "uniqueName": "sea_18",
            "exits": [
                { "x": 0, "y": 1, "targetMap": "underwater_caves", "exitLabel": "подводные пещеры" },
                { "x": 9, "y": 2, "targetMap": "sea_17", "exitLabel": "море" }
            ]
        },
        "sea_17": {
            "mapName": "Море",
            "uniqueName": "sea_17",
            "exits": [
                { "x": 8, "y": 1, "targetMap": "sea_16", "exitLabel": "море" },
                { "x": 9, "y": 3, "targetMap": "azure_island_2", "exitLabel": "лазурный остров" },
                { "x": 0, "y": 4, "targetMap": "sea_18", "exitLabel": "море" }
            ]
        },
        "azure_island_2": {
            "mapName": "Лазурный остров",
            "uniqueName": "azure_island_2",
            "exits": [
                { "x": 7, "y": 2, "targetMap": "azure_island_3", "exitLabel": "лазурный остров" },
                { "x": 0, "y": 4, "targetMap": "shallows_11", "exitLabel": "мелководье" },
                { "x": 4, "y": 5, "targetMap": "azure_island_1", "exitLabel": "лазурный остров" }
            ]
        },
        "azure_island_3": {
            "mapName": "Лазурный остров",
            "uniqueName": "azure_island_3",
            "exits": [
                { "x": 2, "y": 2, "targetMap": "azure_island_2", "exitLabel": "лазурный остров" },
                { "x": 9, "y": 4, "targetMap": "shallows_12", "exitLabel": "мелководье" }
            ]
        },
        "azure_island_1": {
            "mapName": "Лазурный остров",
            "uniqueName": "azure_island_1",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "azure_island_2", "exitLabel": "лазурный остров" },
                { "x": 0, "y": 2, "targetMap": "sea_11", "exitLabel": "море" },
                { "x": 5, "y": 5, "targetMap": "sea_13", "exitLabel": "море" }
            ]
        },
        "shallows_12": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_12",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "azure_island_3", "exitLabel": "лазурный остров" },
                { "x": 6, "y": 0, "targetMap": "sea_15", "exitLabel": "море" },
                { "x": 7, "y": 4, "targetMap": "shallows_12", "exitLabel": "мелководье" }, // self-loop
                { "x": 4, "y": 5, "targetMap": "sea_14", "exitLabel": "море" }
            ]
        },
        "sea_15": {
            "mapName": "Море",
            "uniqueName": "sea_15",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "sea_16", "exitLabel": "море" },
                { "x": 4, "y": 5, "targetMap": "shallows_12", "exitLabel": "мелководье" }
            ]
        },
        "sea_16": {
            "mapName": "Море",
            "uniqueName": "sea_16",
            "exits": [
                { "x": 1, "y": 1, "targetMap": "sea_17", "exitLabel": "море" },
                { "x": 7, "y": 5, "targetMap": "sea_15", "exitLabel": "море" }
            ]
        },

        // --- НОВЫЕ ЛОКАЦИИ ИЗ ТЕКУЩЕГО ЗАПРОСА ---
        "sea_21": {
            "mapName": "Море",
            "uniqueName": "sea_21",
            "exits": [
                { "x": 9, "y": 2, "targetMap": "sea_20", "exitLabel": "море" },
                { "x": 2, "y": 3, "targetMap": "shallows_3", "exitLabel": "мелководье" },
                { "x": 2, "y": 5, "targetMap": "sea_22", "exitLabel": "море" },
                { "x": 5, "y": 5, "targetMap": "sea_22", "exitLabel": "море" }
            ]
        },
        "sea_20": {
            "mapName": "Море",
            "uniqueName": "sea_20",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "sea_19", "exitLabel": "море" },
                { "x": 1, "y": 1, "targetMap": "sea_21", "exitLabel": "море" }
            ]
        },
        "sea_19": {
            "mapName": "Море",
            "uniqueName": "sea_19",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "walnut_island", "exitLabel": "ореховый остров" },
                { "x": 7, "y": 0, "targetMap": "sea_13", "exitLabel": "море" },
                { "x": 8, "y": 1, "targetMap": "shallows_9", "exitLabel": "мелководье" },
                { "x": 7, "y": 4, "targetMap": "sea_19", "exitLabel": "море" }, // self-loop
                { "x": 4, "y": 5, "targetMap": "sea_20", "exitLabel": "море" }
            ]
        },
        "sea_22": {
            "mapName": "Море",
            "uniqueName": "sea_22",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "sea_21", "exitLabel": "море" },
                { "x": 8, "y": 0, "targetMap": "sea_21", "exitLabel": "море" },
                { "x": 0, "y": 4, "targetMap": "shallows_2", "exitLabel": "мелководье" },
                { "x": 8, "y": 5, "targetMap": "sea_23", "exitLabel": "море" }
            ]
        },
        "sea_23": {
            "mapName": "Море",
            "uniqueName": "sea_23",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "sea_22", "exitLabel": "море" },
                { "x": 9, "y": 2, "targetMap": "shallows_8", "exitLabel": "мелководье" }
            ]
        },
        "shallows_9": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_9",
            "exits": [
                { "x": 2, "y": 0, "targetMap": "sea_14", "exitLabel": "море" },
                { "x": 8, "y": 0, "targetMap": "salt_rocks", "exitLabel": "солёные скалы" },
                { "x": 0, "y": 4, "targetMap": "sea_19", "exitLabel": "море" }
            ]
        },
        "salt_rocks": {
            "mapName": "Солёные скалы",
            "uniqueName": "salt_rocks",
            "exits": [
                { "x": 8, "y": 1, "targetMap": "gentle_slope", "exitLabel": "пологий склон" },
                { "x": 0, "y": 2, "targetMap": "shallows_9", "exitLabel": "мелководье" },
                { "x": 9, "y": 5, "targetMap": "border_coast", "exitLabel": "побережье" }
            ]
        },
        "border_coast": {
            "mapName": "Побережье",
            "uniqueName": "border_coast",
            "exits": [
                { "x": 5, "y": 0, "targetMap": "blackberry_bush", "exitLabel": "ежевичник" },
                { "x": 0, "y": 4, "targetMap": "salt_rocks", "exitLabel": "солёные скалы" }
            ]
        },
        "blackberry_bush": {
            "mapName": "Ежевичник",
            "uniqueName": "blackberry_bush",
            "exits": [
                { "x": 0, "y": 0, "targetMap": "rocky_shore", "exitLabel": "каменистый берег" },
                { "x": 5, "y": 0, "targetMap": "ruins_of_walkers", "exitLabel": "развалины прямоходов" },
                { "x": 1, "y": 5, "targetMap": "border_coast", "exitLabel": "побережье" },
                { "x": 8, "y": 5, "targetMap": "broken_rock", "exitLabel": "разбитая скала" }
            ]
        },

        "shallows_11": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_11",
            "exits": [
                { "x": 6, "y": 1, "targetMap": "azure_island_2", "exitLabel": "лазурный остров" },
                { "x": 1, "y": 4, "targetMap": "sea_12", "exitLabel": "море" },
                { "x": 6, "y": 5, "targetMap": "sea_11", "exitLabel": "море" }
            ]
        },
        "sea_12": {
            "mapName": "Море",
            "uniqueName": "sea_12",
            "exits": [
                { "x": 6, "y": 1, "targetMap": "azure_island_2", "exitLabel": "лазурный остров" },
                { "x": 2, "y": 4, "targetMap": "sea_12", "exitLabel": "море" },
                { "x": 9, "y": 5, "targetMap": "shallows_11", "exitLabel": "мелководье" }
            ]
        },
        "sea_11": {
            "mapName": "Море",
            "uniqueName": "sea_11",
            "exits": [
                { "x": 6, "y": 0, "targetMap": "shallows_11", "exitLabel": "мелководье" },
                { "x": 9, "y": 2, "targetMap": "azure_island_1", "exitLabel": "лазурный остров" },
                { "x": 1, "y": 4, "targetMap": "sea_9", "exitLabel": "море" },
                { "x": 1, "y": 5, "targetMap": "sea_10", "exitLabel": "море" }
            ]
        },
        "sea_9": {
            "mapName": "Море",
            "uniqueName": "sea_9",
            "exits": [
                { "x": 1, "y": 3, "targetMap": "sea_8", "exitLabel": "море" },
                { "x": 3, "y": 3, "targetMap": "sea_11", "exitLabel": "море" },
                { "x": 0, "y": 4, "targetMap": "shallows_5", "exitLabel": "мелководье" },
                { "x": 2, "y": 4, "targetMap": "sea_10", "exitLabel": "море" }
            ]
        },
        "sea_8": {
            "mapName": "Море",
            "uniqueName": "sea_8",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "sea_7", "exitLabel": "море" },
                { "x": 0, "y": 1, "targetMap": "sea_5", "exitLabel": "море" },
                { "x": 1, "y": 4, "targetMap": "sea_8", "exitLabel": "море" },
                { "x": 8, "y": 4, "targetMap": "sea_9", "exitLabel": "море" }
            ]
        },
        "sea_10": {
            "mapName": "Море",
            "uniqueName": "sea_10",
            "exits": [
                { "x": 0, "y": 1, "targetMap": "shallows_5", "exitLabel": "мелководье" },
                { "x": 2, "y": 1, "targetMap": "sea_9", "exitLabel": "море" },
                { "x": 9, "y": 1, "targetMap": "sea_11", "exitLabel": "море" },
                { "x": 9, "y": 3, "targetMap": "shallows_10", "exitLabel": "мелководье" },
                { "x": 4, "y": 5, "targetMap": "shallows_3", "exitLabel": "мелководье" }
            ]
        },
        "shallows_10": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_10",
            "exits": [
                { "x": 8, "y": 2, "targetMap": "sea_13", "exitLabel": "море" },
                { "x": 0, "y": 4, "targetMap": "sea_10", "exitLabel": "море" },
                { "x": 6, "y": 5, "targetMap": "walnut_island", "exitLabel": "ореховый остров" }
            ]
        },
        "walnut_island": {
            "mapName": "Ореховый остров",
            "uniqueName": "walnut_island",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "shallows_10", "exitLabel": "мелководье" },
                { "x": 8, "y": 5, "targetMap": "sea_19", "exitLabel": "море" }
            ]
        },
        "sea_13": {
            "mapName": "Море",
            "uniqueName": "sea_13",
            "exits": [
                { "x": 4, "y": 0, "targetMap": "azure_island_1", "exitLabel": "лазурный остров" },
                { "x": 1, "y": 1, "targetMap": "shallows_10", "exitLabel": "мелководье" },
                { "x": 9, "y": 2, "targetMap": "sea_14", "exitLabel": "море" },
                { "x": 8, "y": 5, "targetMap": "sea_19", "exitLabel": "море" }
            ]
        },
        "sea_14": {
            "mapName": "Море",
            "uniqueName": "sea_14",
            "exits": [
                { "x": 7, "y": 0, "targetMap": "shallows_12", "exitLabel": "мелководье" },
                { "x": 1, "y": 5, "targetMap": "sea_13", "exitLabel": "море" },
                { "x": 6, "y": 5, "targetMap": "shallows_9", "exitLabel": "мелководье" }
            ]
        },
        "shallows_3": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_3",
            "exits": [
                { "x": 7, "y": 0, "targetMap": "sea_10", "exitLabel": "море" },
                { "x": 0, "y": 4, "targetMap": "abandoned_lighthouse", "exitLabel": "заброшенный маяк" },
                { "x": 5, "y": 5, "targetMap": "sea_21", "exitLabel": "море" }
            ]
        },
        "shallows_1": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_1",
            "exits": [
                { "x": 1, "y": 0, "targetMap": "east_coast", "exitLabel": "побережье" },
                { "x": 9, "y": 4, "targetMap": "sea_24", "exitLabel": "море" },
                { "x": 5, "y": 5, "targetMap": "shallows_7", "exitLabel": "мелководье" }
            ]
        },
        "shallows_2": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_2",
            "exits": [
                { "x": 7, "y": 0, "targetMap": "sea_22", "exitLabel": "море" },
                { "x": 0, "y": 1, "targetMap": "east_coast", "exitLabel": "побережье" },
                { "x": 2, "y": 5, "targetMap": "sea_24", "exitLabel": "море" }
            ]
        },
        "sea_24": {
            "mapName": "Море",
            "uniqueName": "sea_24",
            "exits": [
                { "x": 7, "y": 0, "targetMap": "shallows_2", "exitLabel": "мелководье" },
                { "x": 0, "y": 1, "targetMap": "shallows_1", "exitLabel": "мелководье" },
                { "x": 1, "y": 5, "targetMap": "shallows_7", "exitLabel": "мелководье" },
                { "x": 4, "y": 5, "targetMap": "black_peaks", "exitLabel": "чёрные пики" }
            ]
        },
        "black_peaks": {
            "mapName": "Черные пики",
            "uniqueName": "black_peaks",
            "exits": [
                { "x": 2, "y": 1, "targetMap": "sea_24", "exitLabel": "море" },
                { "x": 8, "y": 4, "targetMap": "shark_maw", "exitLabel": "акулья пасть" },
                { "x": 4, "y": 5, "targetMap": "sea_25", "exitLabel": "море" }
            ]
        },
        "shark_maw": {
            "mapName": "Акулья пасть",
            "uniqueName": "shark_maw",
            "exits": [
                { "x": 4, "y": 2, "targetMap": "black_peaks", "exitLabel": "чёрные пики" }
            ]
        },
        "sea_25": {
            "mapName": "Море",
            "uniqueName": "sea_25",
            "exits": [
                { "x": 2, "y": 0, "targetMap": "shallows_8", "exitLabel": "мелководье" },
                { "x": 9, "y": 1, "targetMap": "coastal_forest", "exitLabel": "прибрежный лес" },
                { "x": 2, "y": 4, "targetMap": "black_peaks", "exitLabel": "чёрные пики" }
            ]
        },
        "coastal_forest": {
            "mapName": "Прибрежный лес",
            "uniqueName": "coastal_forest",
            "exits": [
                { "x": 3, "y": 0, "targetMap": "broken_rock", "exitLabel": "разбитая скала" },
                { "x": 8, "y": 1, "targetMap": "burned_cedar", "exitLabel": "сожжённый кедр" },
                { "x": 0, "y": 2, "targetMap": "sea_25", "exitLabel": "море" },
                { "x": 6, "y": 3, "targetMap": "lair", "exitLabel": "берлога" }
            ]
        },
        "shallows_8": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_8",
            "exits": [
                { "x": 1, "y": 1, "targetMap": "sea_23", "exitLabel": "море" },
                { "x": 5, "y": 5, "targetMap": "sea_25", "exitLabel": "море" }
            ]
        },
        "shallows_7": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_7",
            "exits": [
                { "x": 9, "y": 0, "targetMap": "shallows_1", "exitLabel": "мелководье" },
                { "x": 0, "y": 2, "targetMap": "south_coast", "exitLabel": "побережье" },
                { "x": 8, "y": 2, "targetMap": "sea_24", "exitLabel": "море" }
            ]
        },

        "sandy_island": {
            "mapName": "Песчаный остров",
            "uniqueName": "sandy_island",
            "exits": [
                { "x": 0, "y": 3, "targetMap": "sea_2", "exitLabel": "море" },
                { "x": 7, "y": 5, "targetMap": "shallows_6", "exitLabel": "мелководье" }
            ]
        },
        "shallows_6": {
            "mapName": "Мелководье",
            "uniqueName": "shallows_6",
            "exits": [
                { "x": 8, "y": 0, "targetMap": "sea_4", "exitLabel": "море" },
                { "x": 5, "y": 1, "targetMap": "sandy_island", "exitLabel": "песчаный остров" }
            ]
        },

        "dv_sea_1": { "mapName": "Море", "uniqueName": "dv_sea_1", "exits": [] },
        "flower_garden": { "mapName": "Цветник", "uniqueName": "flower_garden", "exits": [] },
        "glade_behind_stones": { "mapName": "Полянка за камнями", "uniqueName": "glade_behind_stones", "exits": [] },
        "collectors_hq": { "mapName": "Штаб собирателей", "uniqueName": "collectors_hq", "exits": [] },
        "explorers_hq": { "mapName": "Штаб исследователей", "uniqueName": "explorers_hq", "exits": [] },
        "fighters_hq": { "mapName": "Штаб бойцов", "uniqueName": "fighters_hq", "exits": [] },
        "guards_hq": { "mapName": "Штаб стражей", "uniqueName": "guards_hq", "exits": [] },
        "sandbank": { "mapName": "Отмель", "uniqueName": "sandbank", "exits": [] },
        "broken_rock": { "mapName": "Разбитая скала", "uniqueName": "broken_rock", "exits": [] },
        "burned_cedar": { "mapName": "Сожжённый кедр", "uniqueName": "burned_cedar", "exits": [] },
        "lair": { "mapName": "Берлога", "uniqueName": "lair", "exits": [] },
        "gentle_slope": { "mapName": "Пологий склон", "uniqueName": "gentle_slope", "exits": [] },
        "rocky_shore": { "mapName": "Каменистый берег", "uniqueName": "rocky_shore", "exits": [] },
        "ruins_of_walkers": { "mapName": "Развалины прямоходов", "uniqueName": "ruins_of_walkers", "exits": [] },
    };

    // Глобальная переменная для отслеживания последних выходов для логгирования
    let lastLoggedExits = null;

    // ======================================================================================
    // 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ СО СТРОКАМИ И DOM
    // ======================================================================================
    function getMapUniqueName(mapDisplayName) {
        for (const key in MAP_DATA) {
            if (MAP_DATA[key].mapName === mapDisplayName) {
                return key;
            }
        }
        return null;
    }

    function getEndUniqueName() {
        const dataUniqueName = endLocationInput.dataset.uniqueName;
        if (dataUniqueName && MAP_DATA[dataUniqueName]) {
            return dataUniqueName;
        }
        return getMapUniqueName(endLocationInput.value);
    }

    function getMapDisplayName(uniqueName) {
        return MAP_DATA[uniqueName] ? MAP_DATA[uniqueName].mapName : null;
    }

    /**
     * Сравнивает два массива объектов {x,y} независимо от порядка.
     * @param {Array<Object>} arr1
     * @param {Array<Object>} arr2
     * @returns {boolean}
     */
    function compareCoordArrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const sortedArr1 = [...arr1].sort((a, b) => a.x - b.x || a.y - b.y);
        const sortedArr2 = [...arr2].sort((a, b) => a.x - b.x || a.y - b.y);

        for (let i = 0; i < sortedArr1.length; i++) {
            if (sortedArr1[i].x !== sortedArr2[i].x || sortedArr1[i].y !== sortedArr2[i].y) {
                return false;
            }
        }
        return true;
    }

    function normalizeTextForComparison(text) {
        return text.replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // ======================================================================================
    // 3. UI: СОЗДАНИЕ ИНТЕРФЕЙСА НАВИГАТОРА
    // ======================================================================================
    const navigatorHtmlContent = `
        <div id="catwar-navigator" style="
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #333;
            color: #eee;
            border: 1px solid #555;
            padding: 15px;
            z-index: 10000;
            font-family: sans-serif;
            font-size: 14px;
            border-radius: 8px;
            box-shadow: 3px 3px 8px rgba(0,0,0,0.5);
            width: 280px;
            box-sizing: border-box;
            cursor: grab;
        ">
            <h3 style="margin-top: 0; margin-bottom: 15px; text-align: center; color: #fff;">Навигатор</h3>
            <div id="navigator-input-fields">
                <div style="margin-bottom: 10px;">
                    <label for="start-location" style="display: block; margin-bottom: 5px;">Начальная локация:</label>
                    <input type="text" id="start-location" readonly data-unique-name="" style="width: 100%; padding: 5px; border: 1px solid #555; background-color: #444; color: #eee;">
                </div>
                <div style="margin-bottom: 10px; display: flex; align-items: flex-end;">
                    <label for="end-location" style="display: none;">Конечная локация:</label>
                    <input type="text" id="end-location" data-unique-name="" style="width: calc(100% - 35px); padding: 5px; border: 1px solid #555; background-color: #444; color: #eee; margin-right: 5px;">
                    <button id="select-on-map-btn" style="width: 30px; height: 30px; line-height: 1; padding: 0; border: 1px solid #555; background-color: #444; color: #eee; cursor: pointer; border-radius: 3px;">&#x1F5FA;</button> </div>
                <button id="find-path-btn" style="width: 100%; padding: 8px; background-color: #666; color: white; border: none; border-radius: 3px; cursor: pointer;">Найти путь</button>
                <p id="navigator-status" style="margin-top: 10px; color: #FF6666; font-weight: bold;"></p>
            </div>

            <div id="navigator-map-selector" style="display: none; margin-bottom: 10px; text-align: center;">
                <p style="margin-bottom: 5px; color: #ddd;">Кликните на ячейки перехода:</p>
                <div id="mini-map-container" style="display: inline-block; border: 1px solid #555; width: 220px; height: 132px; overflow: hidden; box-sizing: border-box;">
                    <table id="mini-map-table" style="border-collapse: collapse; width: 100%; height: 100%;">
                        </table>
                </div>
                <button id="confirm-map-selection-btn" style="width: 100%; padding: 5px; background-color: #5cb85c; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 5px;">Подтвердить выбор</button>
                <button id="clear-map-selection-btn" style="width: 100%; padding: 5px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 5px;">Очистить выбор</button>
                <button id="close-map-selector-btn" style="width: 100%; padding: 5px; background-color: #666; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 5px;">Закрыть карту</button>
            </div>

            <div id="route-display" style="margin-top: 15px; border-top: 1px solid #555; padding-top: 10px;">
                <p style="color: #ddd;">Маршрут:</p>
                <ol id="route-list" style="padding-left: 20px; margin-top: 5px; color: #bbb;"></ol>
                <button id="clear-path-btn" style="width: 100%; padding: 8px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer; margin-top: 5px;">Очистить путь</button>
            </div>
        </div>
    `;

    // Глобальные переменные для элементов UI и состояния
    let navigatorWindow, startLocationInput, endLocationInput, findPathBtn, navigatorStatus, routeList, clearPathBtn;
    let selectOnMapBtn, navigatorInputFields, navigatorMapSelector, miniMapTable, confirmMapSelectionBtn, clearMapSelectionBtn, closeMapSelectorBtn;

    let currentRoute = [];
    let currentStepIndex = -1;
    let highlightedCell = null;
    let uiInitialized = false;

    let selectedMiniMapCells = [];

    // Переменные для перетаскивания окна
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    // ======================================================================================
    // 4. ОПРЕДЕЛЕНИЕ ТЕКУЩЕГО МЕСТОПОЛОЖЕНИЯ ПО ПЕРЕХОДАМ НА КАРТЕ
    // ======================================================================================

    /**
     * Сканирует DOM и собирает информацию о видимых переходах на текущей карте.
     * @returns {Array<Object>} Массив объектов переходов с x (0-9), y (0-5) и mapName (текст на клетке).
     */
    function getCurrentMapExitsFromDOM() {
        const exitsOnMap = [];
        const cagesTable = document.getElementById('cages');
        if (!cagesTable) {
            window.navigator_debug_exits = [];
            return exitsOnMap;
        }

        const isExplorationTableMode = cagesTable.tagName === 'TABLE';

        if (!isExplorationTableMode) {
             window.navigator_debug_exits = [];
             return exitsOnMap;
        }

        const rows = cagesTable.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td.cage');
            cells.forEach((cell, cellIndex) => {
                const moveParent = cell.querySelector('.move_parent');
                if (moveParent) {
                    const moveNameElement = moveParent.querySelector('.move_name');
                    const mapName = moveNameElement ? normalizeTextForComparison(moveNameElement.textContent) : '';

                    exitsOnMap.push({
                        x: cellIndex,
                        y: rowIndex,
                        mapName: mapName
                    });
                }
            });
        });

        if (JSON.stringify(exitsOnMap) !== JSON.stringify(lastLoggedExits)) {
            console.log("Навигатор: Обнаружены переходы на карте:", exitsOnMap);
            lastLoggedExits = exitsOnMap;
        }
        window.navigator_debug_exits = exitsOnMap;
        return exitsOnMap;
    }

    /**
     * Определяет уникальное имя текущей локации, сравнивая видимые переходы
     * с данными в MAP_DATA.
     * @returns {string|null} Уникальное имя текущей локации или null, если не найдена.
     */
    function determineCurrentLocationByMapExits() {
        const observedExits = getCurrentMapExitsFromDOM();

        for (const mapUniqueName in MAP_DATA) {
            const mapData = MAP_DATA[mapUniqueName];
            const definedExits = mapData.exits;

            if (observedExits.length !== definedExits.length) {
                continue;
            }

            let allExitsMatch = true;
            for (const observedExit of observedExits) {
                const matchingDefinedExit = definedExits.find(definedExit => {
                    return observedExit.x === definedExit.x &&
                           observedExit.y === definedExit.y &&
                           observedExit.mapName === normalizeTextForComparison(definedExit.exitLabel);
                });

                if (!matchingDefinedExit) {
                    allExitsMatch = false;
                    break;
                }
            }

            if (allExitsMatch) {
                return mapUniqueName;
            }
        }

        return null;
    }

    function updateCurrentLocationDisplay() {
        if (!uiInitialized) return;

        const currentUniqueName = determineCurrentLocationByMapExits();
        if (currentUniqueName) {
            const mapDisplayName = MAP_DATA[currentUniqueName].mapName;
            if (startLocationInput.value !== mapDisplayName || startLocationInput.dataset.uniqueName !== currentUniqueName) {
                 startLocationInput.value = mapDisplayName;
                 startLocationInput.dataset.uniqueName = currentUniqueName;
                 navigatorStatus.textContent = '';
                 if (currentRoute.length > 0) {
                     highlightNextStep();
                 }
            }
        } else {
            startLocationInput.value = "Неизвестно";
            startLocationInput.dataset.uniqueName = "";
            navigatorStatus.textContent = "Не удалось определить текущую локацию. Убедитесь, что вы находитесь в известной локации.";
        }
    }

    // ======================================================================================
    // 5. АЛГОРИТМ ПОИСКА КРАТЧАЙШЕГО ПУТИ (BFS)
    // ======================================================================================
    function findShortestPath(startUniqueName, endUniqueName) {
        if (!MAP_DATA[startUniqueName] || !MAP_DATA[endUniqueName]) {
            return null;
        }

        const queue = [[startUniqueName]];
        const visited = new Set([startUniqueName]);

        while (queue.length > 0) {
            const currentPath = queue.shift();
            const currentLocUniqueName = currentPath[currentPath.length - 1];

            if (currentLocUniqueName === endUniqueName) {
                return currentPath;
            }

            const currentLocData = MAP_DATA[currentLocUniqueName];
            if (!currentLocData || !currentLocData.exits) {
                continue;
            }

            for (const exit of currentLocData.exits) {
                const nextLocUniqueName = exit.targetMap;
                if (MAP_DATA[nextLocUniqueName] && !visited.has(nextLocUniqueName)) {
                    visited.add(nextLocUniqueName);
                    queue.push([...currentPath, nextLocUniqueName]);
                }
            }
        }

        return null;
    }

    // ======================================================================================
    // 6. ОТОБРАЖЕНИЕ МАРШРУТА И НАВИГАЦИЯ ПО НЕМУ
    // ======================================================================================

    function displayRoute(route) {
        routeList.innerHTML = '';
        if (route && route.length > 0) {
            currentRoute = route;
            currentStepIndex = 0;
            navigatorStatus.textContent = '';

            route.forEach((locUniqueName, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${getMapDisplayName(locUniqueName)}`;
                if (index === 0) {
                    li.style.fontWeight = 'bold';
                }
                routeList.appendChild(li);
            });
            highlightNextStep();
            clearPathBtn.style.display = 'block';
        } else {
            currentRoute = [];
            currentStepIndex = -1;
            navigatorStatus.textContent = 'Маршрут не найден.';
            clearPathBtn.style.display = 'none';
        }
    }

    function highlightCell(x, y) {
        if (highlightedCell) {
            highlightedCell.style.border = '';
            highlightedCell.style.backgroundColor = '';
        }

        const domX = x + 1;
        const domY = y + 1;

        if (domX <= 0 || domY <= 0 || domX > 10 || domY > 6) {
             console.warn(`Навигатор: Попытка подсветить клетку вне видимой сетки (0-индекс: ${x}, ${y}).`);
             highlightedCell = null;
             return;
        }

        const targetCell = document.querySelector(`#cages tr:nth-child(${domY}) td.cage:nth-child(${domX})`);
        if (targetCell) {
            targetCell.style.border = '2px solid red';
            targetCell.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            highlightedCell = targetCell;
        } else {
            console.warn(`Навигатор: Клетка с координатами (${domX}, ${domY}) не найдена в DOM.`);
            highlightedCell = null;
        }
    }

    function removeHighlight() {
        if (highlightedCell) {
            highlightedCell.style.border = '';
            highlightedCell.style.backgroundColor = '';
            highlightedCell = null;
        }
    }

    function highlightNextStep() {
        if (!uiInitialized) return;

        if (currentRoute.length === 0 || currentStepIndex === -1) {
            removeHighlight();
            return;
        }

        if (currentStepIndex >= currentRoute.length - 1) {
            navigatorStatus.textContent = 'Маршрут завершен!';
            removeHighlight();
            return;
        }

        const currentLocUniqueName = determineCurrentLocationByMapExits();
        const playerCurrentIndexInRoute = currentRoute.indexOf(currentLocUniqueName);

        if (playerCurrentIndexInRoute !== -1) {
            currentStepIndex = playerCurrentIndexInRoute;

            if (currentStepIndex >= currentRoute.length - 1) {
                navigatorStatus.textContent = 'Маршрут завершен!';
                removeHighlight();
                return;
            }

            const nextExitLocUniqueName = currentRoute[currentStepIndex + 1];
            const currentLocData = MAP_DATA[currentLocUniqueName];

            if (!currentLocData || !currentLocData.exits) {
                navigatorStatus.textContent = 'Ошибка: Данные о текущей локации отсутствуют или неполные.';
                removeHighlight();
                return;
            }

            const nextExit = currentLocData.exits.find(exit => exit.targetMap === nextExitLocUniqueName);

            if (nextExit) {
                highlightCell(nextExit.x, nextExit.y);
                Array.from(routeList.children).forEach((li, index) => {
                    li.style.fontWeight = 'normal';
                    if (index === currentStepIndex) {
                        // Current location (already passed)
                    } else if (index === currentStepIndex + 1) {
                        li.style.fontWeight = 'bold';
                    }
                });
                navigatorStatus.textContent = `Следующий шаг: ${getMapDisplayName(nextExitLocUniqueName)}`;
            } else {
                navigatorStatus.textContent = 'Ошибка: Не могу найти переход к следующей локации в базе данных. Проверьте MAP_DATA.';
                removeHighlight();
            }
        } else {
            navigatorStatus.textContent = 'Внимание: Вы находитесь не на проложенном маршруте. Перейдите на одну из точек маршрута вручную, или очистите путь и проложите заново.';
            removeHighlight();
        }
    }

    // ======================================================================================
    // 7. ИНТЕРАКТИВНЫЙ ВЫБОР ЛОКАЦИИ НА МИНИ-КАРТЕ
    // ======================================================================================

    /**
     * Открывает режим выбора локации на мини-карте.
     */
    function openMapSelection() {
        navigatorInputFields.style.display = 'none';
        navigatorMapSelector.style.display = 'block';
        selectedMiniMapCells = [];
        renderMiniMap();
    }

    /**
     * Закрывает режим выбора локации на мини-карте.
     */
    function closeMapSelection() {
        navigatorInputFields.style.display = 'block';
        navigatorMapSelector.style.display = 'none';
        selectedMiniMapCells = [];
        renderMiniMap();
    }

    /**
     * Генерирует и отображает пустую мини-карту.
     */
    function renderMiniMap() {
        miniMapTable.innerHTML = '';

        for (let y = 0; y < 6; y++) {
            const row = miniMapTable.insertRow();
            for (let x = 0; x < 10; x++) {
                const cell = row.insertCell();
                cell.style.width = '10%';
                cell.style.height = 'calc(100% / 6)';
                cell.style.border = '1px solid #555';
                cell.style.boxSizing = 'border-box';
                cell.style.verticalAlign = 'middle';
                cell.style.textAlign = 'center';
                cell.style.fontSize = '8px';
                cell.style.cursor = 'pointer';
                cell.textContent = '';

                cell.dataset.x = x;
                cell.dataset.y = y;

                const isSelected = selectedMiniMapCells.some(coord => coord.x === x && coord.y === y);
                if (isSelected) {
                    cell.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
                } else {
                    cell.style.backgroundColor = 'transparent';
                }

                cell.onclick = handleMiniMapCellClick;
            }
        }
    }

    /**
     * Обработчик клика по клетке на мини-карте для выбора координат.
     */
    function handleMiniMapCellClick(event) {
        const cell = event.target;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        const index = selectedMiniMapCells.findIndex(coord => coord.x === x && coord.y === y);

        if (index === -1) {
            selectedMiniMapCells.push({ x, y });
            cell.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
        } else {
            selectedMiniMapCells.splice(index, 1);
            cell.style.backgroundColor = 'transparent';
        }
        console.log("Выбраны координаты на мини-карте:", selectedMiniMapCells);
        navigatorStatus.textContent = '';
        endLocationInput.dataset.uniqueName = '';
    }

    function confirmMapSelection() {
        if (selectedMiniMapCells.length === 0) {
            navigatorStatus.textContent = 'Выберите хотя бы одну ячейку на карте.';
            return;
        }

        let foundLocationUniqueName = null;
        let potentialMatches = [];

        for (const locUniqueName in MAP_DATA) {
            const locData = MAP_DATA[locUniqueName];
            const definedExitsCoords = locData.exits.map(exit => ({x: exit.x, y: exit.y}));

            if (compareCoordArrays(selectedMiniMapCells, definedExitsCoords)) {
                potentialMatches.push(locUniqueName);
            }
        }

        if (potentialMatches.length === 1) {
            foundLocationUniqueName = potentialMatches[0];
            endLocationInput.value = MAP_DATA[foundLocationUniqueName].mapName;
            endLocationInput.dataset.uniqueName = foundLocationUniqueName;
            navigatorStatus.textContent = `Конечная локация установлена: ${endLocationInput.value}`;
            closeMapSelection();
        } else if (potentialMatches.length > 1) {
            const matchedNames = potentialMatches.map(uniqueName => MAP_DATA[uniqueName].mapName);
            navigatorStatus.textContent = `Найдено несколько локаций: ${matchedNames.join(', ')}. Пожалуйста, выделите клетки точнее или очистите выбор.`;
            endLocationInput.dataset.uniqueName = '';
        } else {
            navigatorStatus.textContent = 'Локация с таким набором переходов не найдена в базе данных. Пожалуйста, выделите все клетки, которые являются выходами этой локации.';
            endLocationInput.dataset.uniqueName = '';
        }
    }
    /**
     * Очищает текущий выбор ячеек на мини-карте.
     */
    function clearMiniMapSelection() {
        selectedMiniMapCells = [];
        renderMiniMap();
        navigatorStatus.textContent = 'Выбор очищен.';
    }


    // ======================================================================================
    // 8. ОБРАБОТЧИКИ СОБЫТИЙ И ИНИЦИАЛИЗАЦИЯ
    // ======================================================================================

    // Функция для инициализации элементов UI и привязки обработчиков
    function initializeUIAndLogic() {
        if (uiInitialized) return;

        const navigatorContainer = document.getElementById('catwar-navigator');
        if (!navigatorContainer) {
            document.body.insertAdjacentHTML('beforeend', navigatorHtmlContent);
            setTimeout(initializeUIAndLogic, 50);
            return;
        }

        if (startLocationInput && startLocationInput.isConnected) {
            return;
        }

        navigatorWindow = document.getElementById('catwar-navigator');
        startLocationInput = document.getElementById('start-location');
        endLocationInput = document.getElementById('end-location');
        findPathBtn = document.getElementById('find-path-btn');
        navigatorStatus = document.getElementById('navigator-status');
        routeList = document.getElementById('route-list');
        clearPathBtn = document.getElementById('clear-path-btn');

        selectOnMapBtn = document.getElementById('select-on-map-btn');
        navigatorInputFields = document.getElementById('navigator-input-fields');
        navigatorMapSelector = document.getElementById('navigator-map-selector');
        miniMapTable = document.getElementById('mini-map-table');
        confirmMapSelectionBtn = document.getElementById('confirm-map-selection-btn');
        clearMapSelectionBtn = document.getElementById('clear-map-selection-btn');
        closeMapSelectorBtn = document.getElementById('close-map-selector-btn');

        if (!startLocationInput || !selectOnMapBtn) {
            console.warn("Навигатор: Элементы UI не найдены после повторной вставки. Откладываем инициализацию.");
            setTimeout(initializeUIAndLogic, 500);
            return;
        }

        uiInitialized = true;
        console.log("Навигатор: UI успешно инициализирован и обработчики прикреплены.");

        let offsetX, offsetY;

        navigatorWindow.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'LABEL' || e.target.closest('#mini-map-table')) {
                return;
            }
            isDragging = true;
            offsetX = e.clientX - navigatorWindow.getBoundingClientRect().left;
            offsetY = e.clientY - navigatorWindow.getBoundingClientRect().top;
            navigatorWindow.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            navigatorWindow.style.left = (e.clientX - offsetX) + 'px';
            navigatorWindow.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            navigatorWindow.style.cursor = 'grab';
        });

        findPathBtn.addEventListener('click', () => {
            const startUniqueName = startLocationInput.dataset.uniqueName;
            let endUniqueName = endLocationInput.dataset.uniqueName;

            if (!startUniqueName || !MAP_DATA[startUniqueName]) {
                navigatorStatus.textContent = `Не удалось определить начальную локацию. Пожалуйста, убедитесь, что вы находитесь в известной локации.`;
                return;
            }

            if (!endUniqueName) {
                 const potentialEndUniqueNames = [];
                 for (const key in MAP_DATA) {
                     if (MAP_DATA[key].mapName === endLocationInput.value) {
                         potentialEndUniqueNames.push(key);
                     }
                 }
                 if (potentialEndUniqueNames.length === 1) {
                     endUniqueName = potentialEndUniqueNames[0];
                     endLocationInput.dataset.uniqueName = endUniqueName;
                 } else if (potentialEndUniqueNames.length > 1) {
                     navigatorStatus.textContent = `Конечная локация "${endLocationInput.value}" неоднозначна. Пожалуйста, выберите её на карте, чтобы уточнить (например, Море 1, Море 2).`;
                     return;
                 } else {
                     navigatorStatus.textContent = `Неизвестная конечная локация: "${endLocationInput.value}". Пожалуйста, выберите её на карте или введите точное название.`;
                     return;
                 }
            }

            if (startUniqueName === endUniqueName) {
                navigatorStatus.textContent = 'Вы уже в конечной локации!';
                displayRoute([]);
                return;
            }

            const path = findShortestPath(startUniqueName, endUniqueName);

            if (path) {
                displayRoute(path);
            } else {
                displayRoute(null);
            }
        });

        clearPathBtn.addEventListener('click', () => {
            currentRoute = [];
            currentStepIndex = -1;
            routeList.innerHTML = '';
            navigatorStatus.textContent = '';
            removeHighlight();
            clearPathBtn.style.display = 'none';
        });

        endLocationInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                findPathBtn.click();
            }
        });

        selectOnMapBtn.addEventListener('click', openMapSelection);
        closeMapSelectorBtn.addEventListener('click', closeMapSelection);
        confirmMapSelectionBtn.addEventListener('click', confirmMapSelection);
        clearMapSelectionBtn.addEventListener('click', clearMiniMapSelection);

        updateCurrentLocationDisplay();
        clearPathBtn.style.display = 'none';

        const mapObserver = new MutationObserver(() => {
            const cagesTable = document.getElementById('cages');
            if (cagesTable && cagesTable.querySelector('.move_parent')) {
                updateCurrentLocationDisplay();
            }
        });

        const appElement = document.getElementById('app');
        if (appElement) {
            mapObserver.observe(appElement, { childList: true, subtree: true, attributes: true, characterData: true });
            console.log("Навигатор: MutationObserver запущен для отслеживания изменений в #app.");
        } else {
            console.warn("Навигатор: Элемент '#app' не найден. MutationObserver не запущен. Текущая локация будет обновляться только по таймеру.");
            setInterval(updateCurrentLocationDisplay, 2000);
        }
    }

    setInterval(initializeUIAndLogic, 500);

})();

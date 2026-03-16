/// BATTLE DENTIST - GAME LOGIC BLUEPRINT (GameMaker / GML Style)
/// Core Mechanic: Top-Down Combat & Cleaning Blast

// CREATE EVENT (Initialization)
score = 0;
game_timer = 45 * room_speed;
lives = 3;
player_speed = 5;
is_attacking = false;

// List of active "Grime Monsters"
monsters = ds_list_create();

// STEP EVENT (Game Loop)
if (game_timer > 0) {
    game_timer -= 1;
    
    // Player Movement
    var move_x = keyboard_check(vk_right) - keyboard_check(vk_left);
    var move_y = keyboard_check(vk_down) - keyboard_check(vk_up);
    
    x += move_x * player_speed;
    y += move_y * player_speed;
    
    // Shooting / Blasting Logic
    if (mouse_check_button_pressed(mb_left)) {
        scr_fire_cleaning_blast(mouse_x, mouse_y);
    }
} else {
    room_goto(rm_victory);
}

// SCR_FIRE_CLEANING_BLAST (Logic Function)
function scr_fire_cleaning_blast(_tx, _ty) {
    var _blast_power = 10;
    
    // Check for collisions with grime monsters
    with (obj_grime_monster) {
        if (point_distance(x, y, other.x, other.y) < 100) {
            hp -= _blast_power;
            if (hp <= 0) {
                other.score += 100;
                instance_destroy();
                // Create particle effect
                effect_create_above(ef_spark, x, y, 1, c_white);
            }
        }
    }
}

// DRAW EVENT (UI Rendering Logic)
draw_text(10, 10, "SCORE: " + string(score));
draw_text(10, 30, "TIME: " + string(game_timer / room_speed));

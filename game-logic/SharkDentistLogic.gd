extends Node2D

## SHARK DENTIST CHALLENGE - GAME LOGIC BLUEPRINT (Godot/GDScript Style)
## Core Mechanic: Target Precision & Extraction Timer

var score: int = 0
var time_left: float = 60.0
var active_rot_spots: Array = []
var is_game_active: bool = false

class ToothSpot:
	var id: int
	var position: Vector2
	var status: String # "clean", "dirty", "rotten"
	var health: float = 100.0

var teeth: Array = []

func _ready():
	start_game()

func start_game():
	score = 0
	time_left = 60.0
	is_game_active = true
	initialize_shark_mouth()
	spawn_timer.start()

func initialize_shark_mouth():
	for i in range(20): # Shark has many teeth
		var t = ToothSpot.new()
		t.id = i
		t.status = "clean"
		teeth.append(t)

func _process(delta):
	if not is_game_active:
		return
		
	time_left -= delta
	if time_left <= 0:
		end_game()

func spawn_rot():
	# Randomly make a tooth "rotten"
	var random_tooth = teeth[randi() % teeth.size()]
	if random_tooth.status == "clean":
		random_tooth.status = "rotten"
		random_tooth.health = 100.0

func on_tooth_interact(tooth_id: int, tool_type: String):
	var t = teeth[tooth_id]
	if t.status == "clean": return
	
	if tool_type == "brush" and t.status == "dirty":
		t.health -= 25.0
	elif tool_type == "extractor" and t.status == "rotten":
		t.health -= 50.0
		
	if t.health <= 0:
		t.status = "clean"
		score += 50
		emit_signal("tooth_sparkle", t.position)

func end_game():
	is_game_active = false
	print("Shark is happy! Final Score: ", score)

#include <stdio.h>

#define CALLER_ID "SOMENAME001"
#define BUTTON 25

static int waiting = 0;

// configurar botao
static void configure_button (void) {
    gpio_reset_pin(BUTTON);
    gpio_set_direction(BUTTON, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON, GPIO_PULLUP_ONLY);
}

void app_main(void)
{
    configure_button();
}
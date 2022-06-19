package com.softarex.communication.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AndRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String REGISTRATION_PAGE = "/registration";
    private static final String MAIN_PAGE = "/conversations";
    private static final String LOGIN_PAGE = "/login";

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers(REGISTRATION_PAGE).not().fullyAuthenticated()
                .antMatchers(MAIN_PAGE, "/").authenticated()
                .anyRequest().permitAll()
                .and()
                .formLogin()
                    .loginPage(LOGIN_PAGE)
                    .usernameParameter("email")
                    .passwordParameter("password")
                    .defaultSuccessUrl(MAIN_PAGE)
                    .permitAll()
                    .and()
                .rememberMe()
                    .tokenValiditySeconds(7 * 24 * 60 * 60)
                    .key("AbcdefghiJklmNoPqRstUvXyz")
                    .and()
                .logout()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                    .logoutSuccessUrl(LOGIN_PAGE).permitAll()
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID");
    }
}
